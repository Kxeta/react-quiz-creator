import { observable, action, computed } from 'mobx';

class QuizStore {
  @observable questions = [];
  @observable answers = [];
  @action
  setQuiz (items) {
    let questionsArr = [];
    let answersArr = [];
    for (var key in items){
      for (var i in items[key].question.answers){
        let answer = {...items[key].question.answers[i]}
        answer.id = i;
        answer.order = i;
        answer.type = 'answer';
        answer.questionID = key;
        answersArr.push({...answer});
      }
      let question = {...items[key].question}
      question.id = key;
      question.order = key;
      question.type = 'question';
      questionsArr.push({...question});
    }
    this.questions = questionsArr;
    this.answer = answersArr;
  }
}

export default new QuizStore();