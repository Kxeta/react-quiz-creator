import { observable, action, computed } from 'mobx';

class QuizStore {
  @observable questions = [];
  @observable answers = [];
  @action
  setQuiz (items) {
    let questionsArr = [];
    let answersArr = [];
    for (let key in items){
      let question = {...items[key].question}
      question.id = key;
      question.order = key;
      question.type = 'question'
      questionsArr.push({...question});
    }
    this.questions = questionsArr;
  }
}

export default new QuizStore();