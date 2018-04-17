
import { observable, action, computed } from 'mobx';

class QuizStore {
  @observable items = '[]';
  @observable _profiles = '[]';
  
  //Store
  set quiz (items) {
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
  
  //Create JSON return to send to the back-end
  
  getJSONQuiz() {
    let quizJson = this.quiz;
    for(let i in quizJson){
      quizJson[i].order = parseInt(i) + 1;
      if(String(quizJson[i].id).indexOf('new-') > -1){
        quizJson[i].id = null;
      }
      if(quizJson[i].answers.length){
        for(let j in quizJson[i].answers){
          quizJson[i].answers[j].order = parseInt(j) + 1;
          if(String(quizJson[i].answers[j].id).indexOf('new-') > -1){
            quizJson[i].answers[j].id = null;
            quizJson[i].answers[j].questionId = quizJson[i].id;
          }
        }
      }
    }
    console.log(this.quiz,quizJson);
    return quizJson;
  }

  getStringfiedJSONQuiz() {
    let quizJson = this.quiz;
    for(let i in quizJson){
      quizJson[i].order = parseInt(i) + 1;
      if(String(quizJson[i].id).indexOf('new-') > -1){
        quizJson[i].id = null;
      }
      if(quizJson[i].answers.length){
        for(let j in quizJson[i].answers){
          quizJson[i].answers[j].order = parseInt(j) + 1;
          if(String(quizJson[i].answers[j].id).indexOf('new-') > -1){
            quizJson[i].answers[j].id = null;
            quizJson[i].answers[j].questionId = quizJson[i].id;
          }
        }
      }
    }
    return JSON.stringify(quizJson);
  }

  getJSONProfiles() {
    let profilesJson = this.profiles;
    for(let i in profilesJson){
      profilesJson[i].order = parseInt(i) + 1;
      if(String(profilesJson[i].id).indexOf('new-') > -1){
        profilesJson[i].id = null;
      }
    }
    return profilesJson;
  }

  getStringfiedJSONProfiles() {
    let profilesJson = this.profiles;
    for(let i in profilesJson){
      profilesJson[i].order = parseInt(i) + 1;
      if(String(profilesJson[i].id).indexOf('new-') > -1){
        profilesJson[i].id = null;
      }
    }
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
  
  //ADD actions
  @action
  addQuestion(quizId, prevQuestionId = 0){    
    let newQuestion = { 
      "id": "new-" + Math.floor(Math.random()*100*Math.random()*5),
      "text": "",
      "quizId": quizId,
      "order": null,
      "answers": [],
      "required": false
    }
    let modQuiz = this.quiz;
    if (prevQuestionId) {
      let questionIndex = modQuiz.findIndex((item) => {return item.id === prevQuestionId});
      let result = Array.from(modQuiz);
      result.splice(questionIndex, 0, newQuestion);
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
      "id":"new-" + Math.floor(Math.random()*100*Math.random()*5),
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
      "id": "new-" + Math.floor(Math.random()*100*Math.random()*5),
      "title": "",
      "text": "",
      "quizId": quizId,
      "order": null
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
  removeAnswer(id, questionId){
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
    const result = Array.from(modQuiz[questionIndex].answers);
    let answerIndex = result.findIndex((item) => {return item.id === id});
    const [removed] = result.splice(answerIndex, 1);
    modQuiz[questionIndex].answers = result;
    this.quiz = modQuiz;
    this.checkCorrectAnswer(questionId);
  }

  @action
  removeProfile(id){
    let modProfiles = this.profiles;
    let questionIndex = modProfiles.findIndex((item) => {return item.id === id});
    const result = Array.from(modProfiles);
    const [removed] = result.splice(questionIndex, 1);
    
    this.profiles = result;
  }
  
  //Duplicate actions
  @action
  duplicateQuestion(id){
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === id});
    const questionId = "new-" + Math.floor((Math.random() + 1)*100*Math.random()*5);
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
      answerCopy.id = "new-" + Math.floor(Math.random()*100*Math.random()*5);
      answerCopy.questionId = questionId;
    }
    modQuiz.splice(questionIndex + 1, 0, questionCopy);
    
    this.quiz = modQuiz;
    return questionCopy.id;
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