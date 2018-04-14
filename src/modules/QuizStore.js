
import { observable, action, computed } from 'mobx';

class QuizStore {
  @observable items = '[]';

  //Set Store
  @action
   setQuiz (items) {
     this.items = JSON.stringify(items);
   }

   get quiz () {
     return JSON.parse(this.items);
   }

   //Update Element's Content on the Store
   @action
   updateContent (id, questionId, text) {
     let questionIndex = -1;
     if(questionId){
       questionIndex = this.items.findIndex((item) => {return item.id === questionId});
       if(questionIndex > -1){
        let answerIndex = this.items[questionIndex].answers.findIndex((item) => {return item.id === id});
        if(answerIndex > -1){
          this.items[questionIndex].answers[answerIndex].text = text;
        }
       }
     }
     else{
      questionIndex = this.items.findIndex((item) => {return item.id === id})
      if(questionIndex > -1){
          this.items[questionIndex].text = text;
       }
     }
   }

   //Update Element's Correct Answer on the Store
   @action
   updateCorrectContent (id, questionId) {
     //TODO
   }

   //CRUD actions
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

    this.setQuiz(modQuiz);

    console.log('New Question', this.quiz);
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

    this.setQuiz(modQuiz);

    console.log('New Answer', questionId, this.quiz);
   }

   //Remove actions
   @action
   removeQuestion(id){
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === id});
    const result = Array.from(modQuiz);
    const [removed] = result.splice(questionIndex, 1);

    this.setQuiz(result);
   }
   @action
   removeAnswer(id, questionId){
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === questionId});
    const result = Array.from(modQuiz[questionIndex].answers);
    let answerIndex = result.findIndex((item) => {return item.id === id});
    const [removed] = result.splice(answerIndex, 1);
    modQuiz[questionIndex].answers = result
    this.setQuiz(modQuiz);
   }

  //Duplicate actions
  @action
  duplicateQuestion(id){
    let modQuiz = this.quiz;
    let questionIndex = modQuiz.findIndex((item) => {return item.id === id});
    let questionCopy = { 
      "id": "new-" + Math.floor((Math.random() + 1)*100*Math.random()*5),
      "text": modQuiz[questionIndex].text,
      "quizId": modQuiz[questionIndex].quizId,
      "order": null,
      "answers": [],
      "required": modQuiz[questionIndex].required
    };
    for (let i in modQuiz[questionIndex].answers){
      let answerCopy = modQuiz[questionIndex].answers[i];
      answerCopy.id = "new-" + Math.floor(Math.random()*100*Math.random()*5);
      questionCopy.answers.push(answerCopy);
    }
    modQuiz.splice(questionIndex + 1, 0, questionCopy);

    this.setQuiz(modQuiz);
    return questionCopy.id;
  }
}

export default new QuizStore();