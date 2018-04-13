
import { observable, action, computed } from 'mobx';

class QuizStore {
  @observable items = [];

  //Set Store
  @action
   setQuiz (items) {
     this.items = items;
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
   addQuestion(prevQuestionId = 0){
    //TODO
   }
   @action
   addAnswer(questionId){
    //TODO
   }

   //Remove actions
   @action
   removeQuestion(id){
    //TODO
   }
   @action
   removeAnswer(id, questionId){
    //TODO
   }

  //Duplicate actions
  @action
  duplicateQuestion(id){
    //TODO
  }
}

export default new QuizStore();