
import { observable, action } from 'mobx';

class QuizStore {
  @observable items = '[]';
  @observable _profiles = '[]';
  @observable errors = '[]';
  @observable _labels = '[]';
  @observable _configs = '{}';
  @observable _loaded = false;
  @observable _event = '';
  @observable _questionIndex = 0;
  
  //Store
  set quiz (items) {
    try {
      if (!items) {
        return;
      } else if (items && !items.length) {
        this.addQuestion(null);
        return;
      }
    
      let questionId = '';
      for (let i in items) {
      items[i].order = parseInt(i) + 1;
        if (!items[i].id) {
          questionId = "new_" + Math.floor(Math.random()*100*Math.random()*5);
          items[i].id = questionId;
        }
        if (!items[i].answers) {
          items[i].answers = [];
        }
        if (items[i] && items[i].answers && items[i].answers.length) {
          for (let j in items[i].answers) {
            items[i].answers[j].order = parseInt(j) + 1;
            if (!items[i].answers[j].id) {
              items[i].answers[j].id = "new_" + Math.floor(Math.random()*100*Math.random()*5);
              items[i].answers[j].questionId = questionId;
            }
          }
          for (let d = 0; d < this.configs.minAnswers - items[i].answers.length; d++) {
            this.addAnswer(items[i].id, items);
          }
        } else {
          for (let d = 0; d < this.configs.minAnswers; d++) {
            this.addAnswer(items[i].id, items);
          }
        }
      }

      this.items = JSON.stringify(items);
      this._loaded = true;
    } catch(e) {
      console.error(e);
    }
  }
  
  get quiz () {
    return JSON.parse(this.items);
  }

  set profiles (profiles) {
    try {
      if (!profiles) {
        return;
      } else if (profiles && !profiles.length) {
        this.addProfile(null);
        return;
      }

      let profileId = '';
      for (let i in profiles) {
        profiles[i].order = parseInt(i) + 1;
        if (!profiles[i].id) {
          profileId = "new_" + Math.floor(Math.random()*100*Math.random()*5);
          profiles[i].id = profileId;
        }
      }

      this._profiles = JSON.stringify(profiles);
      this._loaded = true;
    } catch(e) {
      console.error(e);
    }
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

  set labels (labels) {
    this._labels = JSON.stringify(labels);
  }

  get labels () {
    return JSON.parse(this._labels);
  }

  set configs (configs) {
    this._configs = JSON.stringify(configs);
  }

  get configs () {
    return JSON.parse(this._configs);
  }

  set loaded (status) {
    this._loaded = status;
  }

  get loaded () {
    return this._loaded;
  }

  set event (event) {
    this._event = event;
  }

  get event () {
    return this._event;
  }

  get questionIndex() {
    return this._questionIndex;
  }
  
  //Create JSON return to send to the back-end
  
  getJSONQuiz() {
    try {
      let quizJsonCopy = JSON.parse(JSON.stringify(this.quiz));
      for (let i in quizJsonCopy) {
        let text = quizJsonCopy[i].text
        text = text.replace(/<(?:.|\n)*?>/gm, '').trim();
        if (quizJsonCopy[i].text.length && text.length) {
          quizJsonCopy[i].order = parseInt(i) + 1;
          if (String(quizJsonCopy[i].id).indexOf('new_') > -1) {
            quizJsonCopy[i].id = null;
          }
          if (quizJsonCopy[i].answers.length) {
            for (let j in quizJsonCopy[i].answers) {
              let text = quizJsonCopy[i].answers[j].text
              text = text.replace(/<(?:.|\n)*?>/gm, '').trim();
              if (quizJsonCopy[i].answers[j].text.length && text.length) {
                quizJsonCopy[i].answers[j].order = parseInt(j) + 1;
                if (String(quizJsonCopy[i].answers[j].id).indexOf('new_') > -1) {
                  quizJsonCopy[i].answers[j].id = null;
                  quizJsonCopy[i].answers[j].questionId = quizJsonCopy[i].id;
                }
              } else {
                quizJsonCopy[i].answers[j].deleted = true;
              }
            }
            let answers = quizJsonCopy[i].answers.filter( answer => !answer.deleted);
            if (answers.length == 0) {
              quizJsonCopy[i].deleted = true;
            }
            quizJsonCopy[i].answers = answers;
          } else {
            quizJsonCopy[i].deleted = true;
          }
        } else {
          quizJsonCopy[i].deleted = true;
        }
      }
      let quizJson = quizJsonCopy.filter( question => !question.deleted);

      return quizJson;
    } catch(e) {
      console.error(e);
    }
  }

  getStringfiedJSONQuiz() {
    try {
      let quizJson = this.getJSONQuiz();
      let errors = [];
      if (quizJson.length) {
        for (let i in quizJson) {
          if (quizJson[i].answers.length < this.configs.minAnswers) {
            let question = parseInt(i) + 1;
            errors.push({
              'questionNr': question,
              'error': 'min_answers_number'
            })
          }
        }
      } else {
        errors.push({
          'error': 'no_questions'
        })
      }
      this.errors = errors;
      let responseJSON =  errors.length ? null : quizJson;
      return JSON.stringify(responseJSON);
    } catch(e) {
      console.error(e);
    }
  }
  getNotValidatedStringfiedJSONQuiz() {
    let quizJson = this.getJSONQuiz();
    return JSON.stringify(quizJson);
  }

  getJSONProfiles() {
    try {
      let profilesJsonCopy = JSON.parse(JSON.stringify(this.profiles));
      for (let i in profilesJsonCopy) {
        let name = profilesJsonCopy[i].name
        name = name.replace(/<(?:.|\n)*?>/gm, '').trim();
        let description = profilesJsonCopy[i].description
        description = description.replace(/<(?:.|\n)*?>/gm, '').trim();
        if (profilesJsonCopy[i].name.length && name.length && profilesJsonCopy[i].description.length && description.length) {
          profilesJsonCopy[i].order = parseInt(i) + 1;
          if (String(profilesJsonCopy[i].id).indexOf('new_') > -1) {
            profilesJsonCopy[i].id = null;
          }
        } else {
          profilesJsonCopy[i].deleted = true;
        }
      }
      let profilesJson = profilesJsonCopy.filter( profile => !profile.deleted);
      
      this.configs = {
        isProfile: true,
        minAnswers: profilesJson.length ? profilesJson.length : 1
      }
      return profilesJson;
    } catch(e) {
      console.error(e);
    }
  }

  isBadgeSaved(profiles) {
    try {
      let result = true;

      for (let i in profiles) {
        if (profiles[i].badge && profiles[i].badge.mediaUpload && profiles[i].badge.mediaUpload.data && !profiles[i].badge.mediaUpload.saved) {
          result = false;
        }
      }

      return result;
    } catch(e) {
      console.error(e);
    }
  }

  getStringfiedJSONProfiles() {
    try {
      let profilesJson = this.getJSONProfiles();
      let errors = [];

      if (!profilesJson.length) {
        errors.push({
          'error': 'no_profiles'
        });
      }

      if (!this.isBadgeSaved(profilesJson)) {
        errors.push({
          'error': 'badge_unsaved'
        });
      }

      this.errors = errors;

      let responseJSON  = errors.length ? 'error' : profilesJson;

      return JSON.stringify(responseJSON);
    } catch(e) {
      console.error(e);
    }
  }

  getNotValidatedStringfiedJSONProfiles() {
    let profilesJson = this.getJSONProfiles();
    return JSON.stringify(profilesJson);
  }
  
  //CRUD actions
  //Update Element's Content on the Store
  @action
  updateQuizContent (id, questionId, text) {
    try {
      let modifiedQuiz = this.quiz;
      let questionIndex = -1;
      if (questionId) {
        questionIndex = modifiedQuiz.findIndex((item) => {return item.id === questionId});
        if (questionIndex > -1) {
          let answerIndex = modifiedQuiz[questionIndex].answers.findIndex((item) => {return item.id === id});
          if (answerIndex > -1) {
            modifiedQuiz[questionIndex].answers[answerIndex].text = text;
          }
        }
      } else {
        questionIndex = modifiedQuiz.findIndex((item) => {return item.id === id})
        if (questionIndex > -1) {
          modifiedQuiz[questionIndex].text = text;
        }
      }
      this.quiz = modifiedQuiz;
    } catch(e) {
      console.error(e);
    }
  }
  
  //Update Element's Correct Answer on the Store
  @action
  updateCorrectAnswer(correct, id, questionId) {
    try {
      let modQuiz = this.quiz;
      let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
      for (let i in modQuiz[questionIndex].answers) {
        if (modQuiz[questionIndex].answers[i].id == id) {
          modQuiz[questionIndex].answers[i].correct = correct;
        } else {
          if (correct) {
            modQuiz[questionIndex].answers[i].correct = false;
          }
        }
      }
      this.quiz = modQuiz;
    } catch(e) {
      console.error(e);
    }
  }
  @action
  updateRequiredQuestion(required, questionId) {
    try {
      let modQuiz = this.quiz;
      let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
      modQuiz[questionIndex].required = required
      this.quiz = modQuiz;
    } catch(e) {
      console.error(e);
    }
  }


  @action
  updateProfileContent(id, type, content) {
    try {
      let modProfiles = this.profiles;
      let profileIndex = -1;
      profileIndex = modProfiles.findIndex((item) => {return item.id === id});
      if (profileIndex > -1) {
        if (type == 'title') {
          modProfiles[profileIndex].name = content;
        }
        if (type == 'description') {
          modProfiles[profileIndex].description = content;
        }
      }
      this.profiles = modProfiles;
    } catch(e) {
      console.error(e);
    }
  }

  @action
  updateProfileBadge(id, file, base64, saved) {
    try {
      let modProfiles = this.profiles;
      let strippedBase64 = (base64 && base64.split(',')[1]) || null;
      let profileIndex = -1;
      profileIndex = modProfiles.findIndex((item) => {return item.id === id});
      if (profileIndex > -1) {
        if (file == null && base64 == null) {
          modProfiles[profileIndex].badge = null;
        } else {
          modProfiles[profileIndex].badge = {};
          modProfiles[profileIndex].badge.url = null;
          modProfiles[profileIndex].badge.mediaUpload = {
            "fileName": file ? file.name : null,
            "type": file ? file.type : null,
            "size": file ? file.size : null,
            "data": strippedBase64,
            "saved": saved
          };
        }
      }
      this.profiles = modProfiles;
    } catch(e) {
      console.error(e);
    }
  }
  
  //ADD actions
  @action
  addQuestion(quizId, prevQuestionId = 0) {
    try {
      this._event = 'question';
      let newQuestionId = "new_" + Math.floor(Math.random()*100*Math.random()*5);
      let answers = []
      for (let i = 0; i < this.configs.minAnswers; i++) {
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
        this._questionIndex = questionIndex;
        let result = Array.from(modQuiz);
        result.splice(questionIndex + 1, 0, newQuestion);
        modQuiz = result;
      } else {
        modQuiz.push(newQuestion);
      }
      
      this.quiz = modQuiz;
    } catch(e) {
      console.error(e);
    }
  }

  @action
  checkQuestionAnswers(questionId) {
    let isEmpty = false;
    let index = [];

    this.quiz.forEach(question => {
      if (question.id === questionId) {
        question.answers.forEach((answer, key) => {
          if (!answer.text.replace(/<[^>]*>/g, '')) {
            isEmpty = true;
            index.push(key);
          }
        });
      }
    });

    return { empty: isEmpty, index: index[0] };
  }

  @action
  addAnswer(questionId, items) {
    try {
      this._event = 'answer';
      let newAnswer = { 
        "id":"new_" + Math.floor(Math.random()*100*Math.random()*5),
        "text": "",
        "correct":false,
        "order":null,
        "questionId": questionId
      }
      let modQuiz = items ? items : this.quiz;
      let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});

      if (questionIndex > -1) {
        if (this.configs.isProfile) {
          if (modQuiz[questionIndex].answers.length < this.configs.minAnswers) {
            modQuiz[questionIndex].answers.push(newAnswer);
          }
        } else {
          modQuiz[questionIndex].answers.push(newAnswer);
        }
      }    
      this.quiz = modQuiz;
    } catch(e) {
      console.error(e);
    }
  }

  @action
  addProfile(quizId) {
    try {
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
    } catch(e) {
      console.error(e);
    }
  }
  
  //Remove actions
  @action
  removeQuestion(id) {
    try {
      let modQuiz = this.quiz;
      let questionIndex = modQuiz.findIndex((item) => {return item.id === id});
      const result = Array.from(modQuiz);
      const [removed] = result.splice(questionIndex, 1);
      
      this.quiz = result;
    } catch(e) {
      console.error(e);
    }
  }
  @action
  removeAnswer(id, questionId, minAnswers = 1) {
    try {
      let errors = [];
      let modQuiz = this.quiz;
      let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
      const result = Array.from(modQuiz[questionIndex].answers);

      if (this.configs.minAnswers) {
        minAnswers = this.configs.minAnswers;
      }
      if (modQuiz[questionIndex].answers.length > minAnswers) {
        let answerIndex = result.findIndex((item) => {return item.id === id});
        const [removed] = result.splice(answerIndex, 1);
        modQuiz[questionIndex].answers = result;
      } else {
        let question = questionIndex + 1;
        errors.push({
          'questionNr': question,
          'error': 'min_answers_number'
        })
      }
      this.quiz = modQuiz;
      this.checkCorrectAnswer(questionId);
      this.errors = errors;
    } catch(e) {
      console.error(e);
    }
  }

  @action
  removeProfile(id, code) {
    try {
      let modProfiles = this.profiles;
      if (modProfiles.length <= 1) {
        return null;
      }
      let questionIndex = modProfiles.findIndex((item) => { return item.id === id });

      const result = Array.from(modProfiles);
      const [removed] = result.splice(questionIndex, 1);

      if (window.profileRemoved) {
        window.profileRemoved(questionIndex);
      }

      if (code && window.removeMedia) {
        window.removeMedia(code);
      }
      
      this.profiles = result;
    } catch(e) {
      console.error(e);
    }
  }

  @action
  clearErrors() {
    this.errors = [];
  }
  
  //Duplicate actions
  @action
  duplicateQuestion(id) {
    try {
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
      for (let i in questionCopy.answers) {
        let answerCopy = questionCopy.answers[i];
        answerCopy.id = "new_" + Math.floor(Math.random()*100*Math.random()*5);
        answerCopy.questionId = questionId;
      }
      modQuiz.splice(questionIndex + 1, 0, questionCopy);

      this._questionIndex = questionIndex;
      
      this.quiz = modQuiz;
      return questionCopy.id;
    } catch(e) {
      console.error(e);
    }
  }

  @action
  duplicateProfile(id) {
    try {
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
    } catch(e) {
      console.error(e);
    }
  }

  @action
  checkCorrectAnswer(questionId) {
    try {
      let modQuiz = this.quiz;
      let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
      let corrects = modQuiz[questionIndex].answers.filter(answer => answer.correct == true);
      if (corrects.length == 0 && modQuiz[questionIndex].answers) {
        modQuiz[questionIndex].answers[0].correct = true;
      }
      this.quiz = modQuiz;
    } catch(e) {
      console.error(e);
    }
  }
}

export default new QuizStore();