import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import './styles/main.scss';
import { DragDropComponent, ImageUploader } from './components';
import { QuizStore } from './modules';



export default class Profiles extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: [],
      labels: {}
    }
    if(window){
      window.updateProfilesStateJSON = this.updateProfilesStateJSON;
      window.updateLabels = this.updateLabels;
    }
  }

  componentDidMount() {
    window.updateProfilesStateJSON = this.updateProfilesStateJSON;
    window.updateLabels = this.updateLabels;

    window.getJSONProfiles = this.getJSONProfiles;
    window.getStringfiedJSONProfiles = this.getStringfiedJSONProfiles;

    if(!window.minAnswers){
      window.minAnswers = 1;
    }
    // this.updateProfilesStateJSON(this.getContentProfilesJSON());
    this.updateLabels(this.getLabelsJSON());
   }

  updateProfilesStateJSON = (items) => {
    QuizStore.profiles = items;
  }

  getJSONProfiles = () =>{
    return QuizStore.getJSONProfiles();
  }

  getStringfiedJSONProfiles = (validate = true) =>{
    if(validate){
      return QuizStore.getStringfiedJSONProfiles();   
    }
    else{
      return QuizStore.getNotValidatedStringfiedJSONProfiles();   
    }
  }

  updateLabels = (labels) => {
    this.setState({
      labels
    });
  }

  getLabelsJSON = () => {
    const json = {
      "pages.quiz.add_new_question": "Adicionar nova pergunta",
      "pages.quiz.new_question": "Nova pergunta",
      "pages.quiz.question": "Pergunta ",
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
  
  getContentProfilesJSON = () => {
    const json = [
      { 
        "id":998,
        "name":"Perfil 1",
        "order": 1,
        "quizId":107,
        "description": "<p>Bacon ipsum dolor amet pancetta dolor ham hock andouille. Biltong incididunt sausage, aliqua ut tongue est sunt elit qui ea pariatur chuck ipsum doner. Ex meatball laborum, filet mignon pastrami qui incididunt. </p> <p>Ball tip picanha sirloin lorem shank elit aliquip ut. Jerky alcatra t-bone, proident ad fatback officia aliqua esse beef voluptate. Eiusmod venison meatball, magna short ribs filet mignon bacon kielbasa chuck incididunt. Biltong proident tri-tip aute est cillum commodo, capicola leberkas.</p>",
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
      },
      { 
        "id":889,
        "name":"Perfil 2",
        "order": 2,
        "quizId":107,
        "description": "<p>Bacon ipsum dolor amet pancetta dolor ham hock andouille. Biltong incididunt sausage, aliqua ut tongue est sunt elit qui ea pariatur chuck ipsum doner. Ex meatball laborum, filet mignon pastrami qui incididunt. </p> <p>Ball tip picanha sirloin lorem shank elit aliquip ut. Jerky alcatra t-bone, proident ad fatback officia aliqua esse beef voluptate. Eiusmod venison meatball, magna short ribs filet mignon bacon kielbasa chuck incididunt. Biltong proident tri-tip aute est cillum commodo, capicola leberkas.</p>",
        "badge": {
          "url": "https://static.simpsonswiki.com/images/thumb/8/83/Bart_skate_-_s25_artwork.png/200px-Bart_skate_-_s25_artwork.png",
          "mediaUpload": {
              "fileName": null,
              "type": null,
              "size": null,
              "data": null
          }
        },
        "pageCode": null,
        "moduleId": null
      },
    ];
  return json;
  }

  render () {
    return (
        <Provider QuizStore = { QuizStore }>
          <div>
            <DragDropComponent labels={this.state.labels} type='profiles' items={ QuizStore } droppableId='profiles-droppable'/>
            <button className='btn' onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.getJSONProfiles(); } }>Get Json!</button>
          </div>
      </Provider>
    );
  }
}