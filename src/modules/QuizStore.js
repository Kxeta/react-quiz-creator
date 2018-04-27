
import { observable, action, computed } from 'mobx';

class QuizStore {
  @observable items = '[]';
  @observable _profiles = '[]';
  @observable errors = '[]';
  
  //Store
  set quiz (items) {
    let questionId = '';
    for(let i in items){
      items[i].order = parseInt(i) + 1;
      if(!items[i].id){
        questionId = "new_" + Math.floor(Math.random()*100*Math.random()*5);
        items[i].id = questionId;
      }
      if(items[i].answers.length){
        for(let j in items[i].answers){
          items[i].answers[j].order = parseInt(j) + 1;
          if(!items[i].answers[j].id){
            items[i].answers[j].id = "new_" + Math.floor(Math.random()*100*Math.random()*5);
            items[i].answers[j].questionId = questionId;
          }
        }
        for(let d = 0; d < window.minAnswers - items[i].answers.length; d++){
          this.addAnswer(items[i].id);
        }
      }
      else{
        for(let d = 0; d < window.minAnswers; d++){
          this.addAnswer(items[i].id);
        }
      }
    }
    if(!items.length){
      this.addQuestion(null);
    }
    this.items = JSON.stringify(items);
  }
  
  get quiz () {
    return JSON.parse(this.items);
  }

  set profiles (profiles) {
    this._profiles = JSON.stringify(profiles);
  }
  
  get profiles () {
    return JSON.parse(this._profiles);
  }

  set errors (errors) {
    this.errors = JSON.stringify(errors);
  }
  
  get errors () {
    return JSON.parse(this.errors);
  }
  
  //Create JSON return to send to the back-end
  
  getJSONQuiz() {
    let quizJsonCopy = JSON.parse(JSON.stringify(this.quiz));
    for(let i in quizJsonCopy){
      let text = quizJsonCopy[i].text
      text = text.replace(/<(?:.|\n)*?>/gm, '').trim();
      if(quizJsonCopy[i].text.length && text.length){
        quizJsonCopy[i].order = parseInt(i) + 1;
        if(String(quizJsonCopy[i].id).indexOf('new_') > -1){
          quizJsonCopy[i].id = null;
        }
        if(quizJsonCopy[i].answers.length){
          for(let j in quizJsonCopy[i].answers){
            let text = quizJsonCopy[i].answers[j].text
            text = text.replace(/<(?:.|\n)*?>/gm, '').trim();
            if(quizJsonCopy[i].answers[j].text.length && text.length){
              quizJsonCopy[i].answers[j].order = parseInt(j) + 1;
              if(String(quizJsonCopy[i].answers[j].id).indexOf('new_') > -1){
                quizJsonCopy[i].answers[j].id = null;
                quizJsonCopy[i].answers[j].questionId = quizJsonCopy[i].id;
              }
            }
            else{
              quizJsonCopy[i].answers[j].deleted = true;
            }
          }
          let answers = quizJsonCopy[i].answers.filter( answer => !answer.deleted);
          console.log('resultado',answers);
          if(answers.length == 0){
            quizJsonCopy[i].deleted = true;
          }
          quizJsonCopy[i].answers = answers;
        }
        else{
          quizJsonCopy[i].deleted = true;
        }
      }
      else{
        quizJsonCopy[i].deleted = true;
      }
    }
    let quizJson = quizJsonCopy.filter( question => !question.deleted);
    let errors = [];
    if(quizJson.length){
      for(let i in quizJson){
        if(quizJson[i].answers.length < window.minAnswers){
          let question = parseInt(i) + 1;
          errors.push({
            'questionNr': question,
            'error': 'min_answers_number'
          })
        }
      }
    }
    else{
      errors.push({
        'error': 'no_questions'
      })
    }
    this.errors = errors;
    console.log(this.quiz, quizJson, errors);
    let responseJSON =  errors.length ? null : quizJson;
    return responseJSON;
  }

  getStringfiedJSONQuiz() {
    let quizJson = this.getJSONQuiz();
    return JSON.stringify(quizJson);
  }
  getNotValidatedStringfiedJSONQuiz() {
    let quizJson = this.quiz;
    return JSON.stringify(quizJson);
  }

  getJSONProfiles() {
    let profilesJsonCopy = JSON.parse(JSON.stringify(this.profiles));
    for(let i in profilesJsonCopy){
      let name = profilesJsonCopy[i].name
      name = name.replace(/<(?:.|\n)*?>/gm, '').trim();
      let description = profilesJsonCopy[i].description
      description = description.replace(/<(?:.|\n)*?>/gm, '').trim();
      if(profilesJsonCopy[i].name.length && name.length && profilesJsonCopy[i].description.length && description.length){
        profilesJsonCopy[i].order = parseInt(i) + 1;
        if(String(profilesJsonCopy[i].id).indexOf('new_') > -1){
          profilesJsonCopy[i].id = null;
        }
      }
      else{
        profilesJsonCopy[i].deleted = true;
      }
    }
    let profilesJson = profilesJsonCopy.filter( profile => !profile.deleted);

    let errors = [];
    if(!profilesJson.length){
      errors.push({
        'error': 'no_profiles'
      })
    }
    this.errors = errors;
    
    console.log(this.profiles, profilesJson, errors);

    window.minAnswers = profilesJson.length ? profilesJson.length : 1;
    let responseJSON  = errors.length ? null : profilesJson;
    return responseJSON;
  }

  getStringfiedJSONProfiles() {
    let profilesJson = this.getJSONProfiles()
    return JSON.stringify(profilesJson);
  }

  getNotValidatedStringfiedJSONProfiles() {
    let profilesJson = this.profiles;
    return JSON.stringify(profilesJson);
  }
  
  //CRUD actions
  //Update Element's Content on the Store
  @action
  updateQuizContent (id, questionId, text) {
    let modifiedQuiz = this.quiz;
    let questionIndex = -1;
    if(questionId){
      questionIndex = modifiedQuiz.findIndex((item) => {return item.id === questionId});
      if(questionIndex > -1){
        let answerIndex = modifiedQuiz[questionIndex].answers.findIndex((item) => {return item.id === id});
        if(answerIndex > -1){
          modifiedQuiz[questionIndex].answers[answerIndex].text = text;
        }
      }
    }
    else{
      questionIndex = modifiedQuiz.findIndex((item) => {return item.id === id})
      if(questionIndex > -1){
        modifiedQuiz[questionIndex].text = text;
      }
    }
    this.quiz = modifiedQuiz;
  }
  
  //Update Element's Correct Answer on the Store
  @action
  updateCorrectAnswer (correct, id, questionId) {
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
    for(let i in modQuiz[questionIndex].answers){
      if(modQuiz[questionIndex].answers[i].id == id){
        modQuiz[questionIndex].answers[i].correct = correct;
      }
      else{
        if(correct){
          modQuiz[questionIndex].answers[i].correct = false;
        }
      }
    }
    this.quiz = modQuiz;
  }
  @action
  updateRequiredQuestion(required, questionId){
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
    modQuiz[questionIndex].required = required
    this.quiz = modQuiz;
  }


  @action
  updateProfileContent(id, type, content){
    let modProfiles = this.profiles;
    let profileIndex = -1;
    profileIndex = modProfiles.findIndex((item) => {return item.id === id});
    if(profileIndex > -1){
      if(type == 'title'){
        modProfiles[profileIndex].name = content;
      }
      if(type == 'description'){
        modProfiles[profileIndex].description = content;
      }
    }
    this.profiles = modProfiles;
  }

  @action
  updateProfileBadge(id, file, base64){
    let modProfiles = this.profiles;
    let strippedBase64 = (base64 && base64.split(',')[1]) || null;
    let profileIndex = -1;
    profileIndex = modProfiles.findIndex((item) => {return item.id === id});
    if(profileIndex > -1){
      if(file == null && base64 == null){
        modProfiles[profileIndex].badge = null;
      }
      else{
        modProfiles[profileIndex].badge = {};
        modProfiles[profileIndex].badge.url = null;
        modProfiles[profileIndex].badge.mediaUpload = {
          "fileName": file ? file.name : null,
          "type": file ? file.type : null,
          "size": file ? file.size : null,
          "data": strippedBase64
        };
      }
    }
    this.profiles = modProfiles;
  }
  
  //ADD actions
  @action
  addQuestion(quizId, prevQuestionId = 0){    
    let newQuestionId = "new_" + Math.floor(Math.random()*100*Math.random()*5);
    let answers = []
    for(let i = 0; i < window.minAnswers; i++){
      let correct = i == 0 ? true : false;
      let newAnswer = { 
        "id":"new_" + Math.floor(Math.random()*100*Math.random()*5),
        "text": "",
        "correct":correct,
        "order":null,
        "questionId": newQuestionId
      }
      answers.push(newAnswer);
    }

    let newQuestion = { 
      "id": newQuestionId,
      "text": "",
      "quizId": quizId,
      "order": null,
      "answers": answers,
      "required": false
    }
    let modQuiz = this.quiz;
    if (prevQuestionId) {
      let questionIndex = modQuiz.findIndex((item) => {return item.id === prevQuestionId});
      let result = Array.from(modQuiz);
      result.splice(questionIndex + 1, 0, newQuestion);
      modQuiz = result;
    }
    else{
      modQuiz.push(newQuestion);
    }
    
    this.quiz = modQuiz;
  }
  @action
  addAnswer(questionId){
    let newAnswer = { 
      "id":"new_" + Math.floor(Math.random()*100*Math.random()*5),
      "text": "",
      "correct":false,
      "order":null,
      "questionId": questionId
    }
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
    modQuiz[questionIndex].answers.push(newAnswer);
    
    this.quiz = modQuiz;
  }

  @action
  addProfile(quizId){
    let newProfile = { 
      "id": "new_" + Math.floor(Math.random()*100*Math.random()*5),
      "name": "",
      "description": "",
      "quizId": quizId,
      "order": null,
      "badge": {
        "url": null,
        "mediaUpload": {
            "fileName": null,
            "type": null,
            "size": null,
            "data": null
        }
      },
      "pageCode": null,
      "moduleId": null
    }
    let modProfiles = this.profiles;
    modProfiles.push(newProfile);
    this.profiles = modProfiles;
  }
  
  //Remove actions
  @action
  removeQuestion(id){
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === id});
    const result = Array.from(modQuiz);
    const [removed] = result.splice(questionIndex, 1);
    
    this.quiz = result;
  }
  @action
  removeAnswer(id, questionId, minAnswers = 1){
    let errors = [];
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
    const result = Array.from(modQuiz[questionIndex].answers);
    if(window && window.minAnswers){
      minAnswers = window.minAnswers;
    }
    if(modQuiz[questionIndex].answers.length > minAnswers){
      let answerIndex = result.findIndex((item) => {return item.id === id});
      const [removed] = result.splice(answerIndex, 1);
      modQuiz[questionIndex].answers = result;
    }
    else{
      let question = questionIndex + 1;
      console.log(question);
      errors.push({
        'questionNr': question,
        'error': 'min_answers_number'
      })
    }
    this.quiz = modQuiz;
    this.checkCorrectAnswer(questionId);
    this.errors = errors;
  }

  @action
  removeProfile(id){
    let modProfiles = this.profiles;
    let questionIndex = modProfiles.findIndex((item) => {return item.id === id});
    const result = Array.from(modProfiles);
    const [removed] = result.splice(questionIndex, 1);
    
    this.profiles = result;
  }

  @action
  clearErrors(){
    this.errors = [];
  }
  
  //Duplicate actions
  @action
  duplicateQuestion(id){
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === id});
    const questionId = "new_" + Math.floor((Math.random() + 1)*100*Math.random()*5);
    let questionCopy = { 
      "id": questionId,
      "text": modQuiz[questionIndex].text,
      "quizId": modQuiz[questionIndex].quizId,
      "order": null,
      "answers": JSON.parse(JSON.stringify(modQuiz[questionIndex].answers)),
      "required": modQuiz[questionIndex].required
    };
    for (let i in questionCopy.answers){
      let answerCopy = questionCopy.answers[i];
      answerCopy.id = "new_" + Math.floor(Math.random()*100*Math.random()*5);
      answerCopy.questionId = questionId;
    }
    modQuiz.splice(questionIndex + 1, 0, questionCopy);
    
    this.quiz = modQuiz;
    return questionCopy.id;
  }

  @action
  duplicateProfile(id){
    let modProfiles = this.profiles;
    let profileIndex = modProfiles.findIndex((item) => {return item.id === id});
    const profileId = "new_" + Math.floor((Math.random() + 1)*100*Math.random()*5);
    let profileCopy = { 
      "id": profileId,
      "name": modProfiles[profileIndex].name,
      "description": modProfiles[profileIndex].description,
      "quizId": modProfiles[profileIndex].quizId,
      "order": null,
      "badge": null,
      "pageCode": modProfiles[profileIndex].pageCode,
      "moduleId": modProfiles[profileIndex].moduleId
    };
    modProfiles.splice(profileIndex + 1, 0, profileCopy);
    
    this.profiles = modProfiles;
    return profileCopy.id;
  }

  @action
  checkCorrectAnswer(questionId){
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
    let corrects = modQuiz[questionIndex].answers.filter(answer => answer.correct == true);
    if(corrects.length == 0 && modQuiz[questionIndex].answers){
      modQuiz[questionIndex].answers[0].correct = true;
    }
    this.quiz = modQuiz;
  }
}

export default new QuizStore();