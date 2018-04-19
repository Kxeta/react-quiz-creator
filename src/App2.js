import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import './styles/main.scss';
import { DragDropComponent, ImageUploader } from './components';
import { QuizStore } from './modules';



export default class App2 extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: []
    }
    if(window){
      window.updateProfilesStateJSON = this.updateProfilesStateJSON;
    }
  }

  componentDidMount() {
    window.updateProfilesStateJSON = this.updateProfilesStateJSON;
    this.updateProfilesStateJSON(this.getContentProfilesJSON());
   }

  updateProfilesStateJSON = (items) => {
    QuizStore.profiles = items;
  }
  
  getContentProfilesJSON = () => {
    const json = [
      { 
        "id":998,
        "title":"Perfil 1",
        "order": 1,
        "quizId":107,
        "text": "<p>Bacon ipsum dolor amet pancetta dolor ham hock andouille. Biltong incididunt sausage, aliqua ut tongue est sunt elit qui ea pariatur chuck ipsum doner. Ex meatball laborum, filet mignon pastrami qui incididunt. </p> <p>Ball tip picanha sirloin lorem shank elit aliquip ut. Jerky alcatra t-bone, proident ad fatback officia aliqua esse beef voluptate. Eiusmod venison meatball, magna short ribs filet mignon bacon kielbasa chuck incididunt. Biltong proident tri-tip aute est cillum commodo, capicola leberkas.</p>",
        "badge": {
          "url": null,
          "name": null, 
          "type": null,
          "size": null,
          "data": null
        },
        "pageCode": null,
        "moduleId": null
      },
      { 
        "id":889,
        "title":"Perfil 2",
        "order": 2,
        "quizId":107,
        "text": "<p>Bacon ipsum dolor amet pancetta dolor ham hock andouille. Biltong incididunt sausage, aliqua ut tongue est sunt elit qui ea pariatur chuck ipsum doner. Ex meatball laborum, filet mignon pastrami qui incididunt. </p> <p>Ball tip picanha sirloin lorem shank elit aliquip ut. Jerky alcatra t-bone, proident ad fatback officia aliqua esse beef voluptate. Eiusmod venison meatball, magna short ribs filet mignon bacon kielbasa chuck incididunt. Biltong proident tri-tip aute est cillum commodo, capicola leberkas.</p>",
        "badge": {
          "url": null,
          "name": null, 
          "type": null,
          "size": null,
          "data": null
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
            <DragDropComponent type='profiles' items={ QuizStore } droppableId='profiles-droppable'/>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); QuizStore.getJSONProfiles(); } }>Get Json!</button>
          </div>
      </Provider>
    );
  }
}