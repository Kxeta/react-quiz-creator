import { observable, action, computed } from 'mobx';

class QuizStore {
  @observable questions = [];
  @observable answers = [];
  @action
   setQuestions (items) {
     this.questions = items;
   }
   @action
   setAnswers (items) {
     this.answers = items;
   }
}

export default new QuizStore();