import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import DroppableComponent from './DroppableComponent';
import './SortableComponent.scss';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result[startIndex].order = startIndex + 1;
  result[endIndex].order = endIndex + 1;

  return result;
};


export default class DragDropComponent extends Component{

  static propTypes = { 
    items: PropTypes.array,
    type: PropTypes.string,
    droppableId: PropTypes.string,
    callbackUpdate: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }
 
  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.state.items) != JSON.stringify(nextProps.items)){
      this.setState({items: nextProps.items});
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return ((JSON.stringify(this.state.items) != JSON.stringify(nextProps.items)) ||
           (JSON.stringify(this.state.items) != JSON.stringify(nextState.items)));
   }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if(result.type.indexOf('question') >= 0){
      const destination = result.destination.index;
      const begin = result.source.index;
      let items = [...this.state.items];
      items = reorder(items, begin, destination)
      console.log('Reordered', items);
      this.props.callbackUpdate(items);
    }

    else if(result.type.indexOf('answer') >= 0){
      let items = this.state.items;
      let questionId = parseInt(result.type.split('-')[1]);
      let questionIndex = -1;
      items.find(function(item, i){
        if(item.id === questionId){
          questionIndex = i;
          return i;
        }
      });
      if(questionIndex >= 0){
        var list = items[questionIndex].answers;
        let answers = reorder(
          list,
          result.source.index,
          result.destination.index
        );
        items.find(function(item, i){
          if(item.id === questionId){
            questionIndex = i;
            return i;
          }
        });
        items[questionIndex].answers = answers;
        console.log('Reordered', items);
        this.props.callbackUpdate(items);
      }
      else{
        return;
      }
    }
  }

  render() {
    console.log('Render DragDrop!', this.state.items); 
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <DroppableComponent type={ this.props.type } items={this.state.items} droppableId={ this.props.droppableId }>
        </DroppableComponent>
      </DragDropContext>
    );
  }
  
}