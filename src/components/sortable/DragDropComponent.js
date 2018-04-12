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
 
  componentWillReceiveProps(nextProps) {
    if(this.state.items != nextProps.items){
      this.setState({items: nextProps.items});
    }
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

      this.setState({
        items
      })
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
        console.log(items[questionIndex].answers);
        this.setState({
          items
        })
      }
      else{
        return;
      }
    }

    // this.setState({items});
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