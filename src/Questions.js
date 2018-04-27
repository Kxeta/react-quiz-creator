import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import './styles/main.scss';
import { DragDropComponent, ImageUploader } from './components';
import { QuizStore } from './modules';



export default class Questions extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: [],
      labels: {}
    }
    if(window){
      window.updateQuizStateJSON = this.updateQuizStateJSON;
      window.updateLabels = this.updateLabels;
      window.getQuizStateJSON = this.getQuizStateJSON;
    }
  }
  
  componentDidMount() {
    window.updateQuizStateJSON = this.updateQuizStateJSON;
    window.updateLabels = this.updateLabels;

    window.getQuizStateJSON = this.getJSONQuiz;
    window.getQuizStateStringifiedJSON = this.getStringfiedJSONQuiz;

    if(!window.minAnswers){
      window.minAnswers = 1;
    }
    // this.updateQuizStateJSON(this.getContentJSON());
    this.updateLabels(this.getLabelsJSON());
   }

  getQuizStateJSON = () =>{
    return QuizStore.getJSONQuiz();
  }

  getStringfiedJSONQuiz = (validate = true) =>{
    if(validate){
      return QuizStore.getStringfiedJSONQuiz();
    }
    else{
      return QuizStore.getNotValidatedStringfiedJSONQuiz();
    }
  }
  
  updateQuizStateJSON = (items) => {
    QuizStore.quiz = items;
  }
  updateLabels = (labels) => {
    this.setState({
      labels
    });
  }

  getLabelsJSON = () => {
    const json = {
      "pages.quiz.add_new_question": "Adicionar nova pergunta",
      "pages.quiz.question": "Pergunta ",
      "pages.quiz.new_question": "Nova pergunta",
      "pages.quiz.add_new_answer": "Adicionar nova resposta",
      "pages.quiz.new_answer": "Nova resposta",
      "pages.quiz.add_new_profile": "Adicionar nova perfil",
      "pages.quiz.new_profile": "Novo perfil",
      "pages.quiz.new_description_profile": "Descrição do perfil",
      "pages.quiz.correct_answer": "Resposta correta",
      "general.mandatory": "Obrigatória",
      "general.remove": "Remover",
      "general.duplicate": "Duplicar",
      "general.change": "Trocar",
      "pages.quiz.insert_image": "Inserir imagem",
      "pages.quiz.send_image": "Enviar imagem",
      "pages.quiz.min_answers": "O mínimo de respostas para as perguntas deste quiz é de: ",
      "pages.quiz.insert_image_tip_1": "Quando o usuário concluir o Quiz e se encaixar neste Perfil, essa é a imagem que aparecerá em seu resultado.",
      "pages.quiz.insert_image_tip_2": "Dica: utilize fotos que se encaixem no contexto ou crie uma imagem customizada.",
      "pages.quiz.insert_image_tip_3": "Tamanho Máximo: 2Mb",
      "pages.quiz.no_questions": "Não é possível cadastrar um quiz sem nenhuma pergunta ou com respostas vazias",
      "pages.quiz.no_profiles": "Não é possível cadastrar um quiz de perfil sem nenhum perfil ou com conteúdo vazio",
      "general.we_had_problems": "Encontramos o(s) seguinte(s) problema(s):",
    }
    return json;
  }
  
  getContentJSON = () => {
    const json = [
      { 
        "id":567,
        "text":"Pergunta 1",
        "quizId":107,
        "answers":[
          { "id":462,
            "text":"Resposta 1 - pergunta 1",
            "correct":true,
            "order":1,
            "questionId": 567
          },
          { "id":463,
            "text":"Resposta 2 - pergunta 1",
            "correct":false,
            "order":2,
            "questionId": 567
          },
          { "id":464,
            "text":"Resposta 3 - pergunta 1",
            "correct":false,
            "order":3,
            "questionId": 567
          }
        ],
        "order":1,
        "required":true
      },
      { 
        "id":221,
        "text":"Pergunta 2",
        "quizId":107,
        "answers":[
          { "id":231,
            "text":"Resposta 1 - pergunta 2",
            "correct":true,
            "order":1,
            "questionId": 221
          },
          { "id":232,
            "text":"Resposta 2 - pergunta 2",
            "correct":false,
            "order":2,
            "questionId": 221
          },
          { "id":233,
            "text":"Resposta 3 - pergunta 2",
            "correct":false,
            "order":3,
            "questionId": 221
          }
        ],
        "order":2,
        "required":false
      }
    ];
  return json;
  }

  render () {
    return (
      <Provider QuizStore = { QuizStore }>
        <div>
          <DragDropComponent labels={this.state.labels} type='question' items={ QuizStore } droppableId='question-droppable'/>
          <button className='btn' onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.getJSONQuiz(); } }>Get Json!</button>
        </div>
      </Provider>
    );
  }
}