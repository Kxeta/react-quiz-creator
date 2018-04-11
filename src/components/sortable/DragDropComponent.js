import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import DroppableComponent from './DroppableComponent';
import './SortableComponent.scss';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


export default class DragDropComponent extends Component{

  static propTypes = { 
    items: PropTypes.array,
    type: PropTypes.string,
    droppableId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }
 

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    console.log(result);


    if(result.type.indexOf('question') >= 0){
      const destination = result.destination.index;
      const begin = result.source.index;
      let items = [...this.state.items];
      items = reorder(items, begin, destination)

      this.setState({
        items
      }, () => {console.log('updated questions!', this.state.items)})
    }

    else if(result.type.indexOf('answer') >= 0){
      let items = this.state.items;
      let questionId = parseInt(result.draggableId.split('-')[1]);
      let questionIndex = -1;
      items.find(function(item, i){
        if(item.id === questionId){
          questionIndex = i;
          return i;
        }
      });
      var list = items[questionIndex].answers;
      let answers = reorder(
        list,
        result.source.index,
        result.destination.index
      );
      items.find(function(item, i){
        if(item.name === questionId){
          questionIndex = i;
          return i;
        }
      });
      items[questionIndex].answers = answers;
      console.log(items[questionIndex].answers);
      this.setState({
        items
      }, () => {console.log('updated answers!', this.state.items)})
    }

    // this.setState({items});
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <DroppableComponent type={ this.props.type } items={this.state.items} droppableId={ this.props.droppableId }>
        </DroppableComponent>
      </DragDropContext>
    );
  }
  
}