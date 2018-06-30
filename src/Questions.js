import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import './styles/main.scss';
import { DragDropComponent } from './components';
import { QuizStore } from './modules';



export default class Questions extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: []
    }
    if(window){
      window.updateQuizStateJSON = this.updateQuizStateJSON;
      window.updateLabels = this.updateLabels;
      window.setConfigs = this.updateConfigs;
      window.getQuizStateJSON = this.getQuizStateJSON;
    }
  }
  
  componentDidMount() {
    window.updateQuizStateJSON = this.updateQuizStateJSON;
    window.updateLabels = this.updateLabels;
    window.setConfigs = this.updateConfigs;

    window.getQuizStateJSON = this.getJSONQuiz;
    window.getQuizStateStringifiedJSON = this.getStringfiedJSONQuiz;

    this.updateLabels(this.getLabelsJSON());
    this.updateConfigs({ isProfile: false, minAnswers: 1});
   }

  getQuizStateJSON = () => {
    return QuizStore.getJSONQuiz();
  }

  getStringfiedJSONQuiz = (validate = true) => {
    if (validate) {
      return QuizStore.getStringfiedJSONQuiz();
    } else {
      return QuizStore.getNotValidatedStringfiedJSONQuiz();
    }
  }
  
  updateQuizStateJSON = (items) => {
    QuizStore.quiz = items;
  }

  updateLabels = labels => {
    QuizStore.labels = labels;
  }

  updateConfigs = configs => {
    QuizStore.configs = configs;
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
      "pages.quiz.badge_unsaved": "É necessário salvar a imagem do perfil antes de prosseguir",
      "general.mandatory": "Obrigatória",
      "general.remove": "Remover",
      "general.duplicate": "Duplicar",
      "general.change": "Trocar",
      "pages.quiz.insert_image": "Inserir imagem",
      "general.send_image": "Enviar imagem",
      "pages.quiz.min_answers": "O mínimo de respostas para as perguntas deste quiz é de: ",
      "pages.quiz.insert_image_tip_1": "Quando o usuário concluir o Quiz e se encaixar neste Perfil, essa é a imagem que aparecerá em seu resultado.",
      "pages.quiz.insert_image_tip_2": "Dica: utilize fotos que se encaixem no contexto ou crie uma imagem customizada.",
      "pages.quiz.insert_image_tip_3": "Tamanho Máximo: 2Mb",
      "pages.quiz.no_questions": "Não é possível cadastrar um quiz sem nenhuma pergunta ou com respostas vazias",
      "pages.quiz.no_profiles": "Não é possível cadastrar um quiz de perfil sem nenhum perfil ou com conteúdo vazio",
      "general.we_had_problems": "Encontramos o(s) seguinte(s) problema(s):",
      "pages.quiz.max_characters": "Máximo de 500 caracteres!"
    }
    return json;
  }

  render () {
    return (
      <Provider QuizStore = { QuizStore }>
        <div>
          <DragDropComponent type='question' items={ QuizStore } droppableId='question-droppable'/>
          <button className='btn' onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log(QuizStore.getJSONQuiz()); } }>Console Json!</button>
        </div>
      </Provider>
    );
  }
}