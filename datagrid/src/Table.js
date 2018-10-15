import React from 'react';
import axios from 'axios';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data } from 'react-data-grid-addons';
import Form from "react-jsonschema-form";
import 'bootstrap/dist/css/bootstrap.css';
import './Table.css';


const Selectors = Data.Selectors;

const schema = {
  title: "Add New Record",
  type: "object",
  required: [],
  properties: {
    title: {type: "string", title: "Title"},
    content: {type: "string", title: "Content"}
  }
};

const auth = {
  auth: {
  username: process.env.REACT_APP_KINTO_USER,
  password: process.env.REACT_APP_KINTO_PASSWORD
}};


class Table extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      rows: '',
      filters: {},
      value: '',
      scrollToRowIndex: ''
    }
    this._columns = [
      { key: 'row', name: 'Row', resizable: true, filterable: true},
      { key: 'id', name: 'ID', resizable: true, filterable: true},
      { key: 'title', name: 'Title', resizable: true, filterable: true },
      { key: 'content', name: 'Content', resizable: true, filterable: true } ];

    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    axios.get('http://localhost:8888/v1/buckets/default/collections/test-1/records', auth)
    .then((res) => {
      let rows = [];
      for (let i = 0; i < res.data.data.length; i++) {
        rows.push({
          row: i + 1,
          id: res.data.data[i].id,
          title: res.data.data[i].title,
          content: res.data.data[i].content
        });
      }
      this.setState({
        rows: rows
      });
    })
    .catch((err) => { console.log(err); })
  }

  getRows = () => {
    return Selectors.getRows(this.state);
  };

  getSize = () => {
    return this.getRows().length;
  };

  rowGetter = (rowIdx) => {
     let rows = this.getRows();
     return rows[rowIdx];
   };

  submitForm = ({formData}) => {
    axios.post('http://localhost:8888/v1/buckets/default/collections/test-1/records', {"data":formData}, auth)
      .then((res) => {
        this.getData();
      })
      .catch((err) => { console.log(err); })
  }

  handleFilterChange = (filter) => {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  };

  onClearFilters = () => {
    // all filters removed
    this.setState({filters: {} });
  };

  render() {
    return  (
      <div className="main">
        <Form schema={schema} onSubmit={this.submitForm} />
        <div className="scrollToRow">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <span style={{marginRight: '10px'}}>Row Number: </span>
            <input
              style={{marginRight: '10px', border: '1px outset lightgray', padding: '3px'}}
              type='text'
              value={this.state.value}
              onChange={(event) => { this.setState({value: event.target.value})}} />
            <button
              style={{padding: '5px'}}
              onClick={() => this.setState({scrollToRowIndex: this.state.value - 1})}>Scroll to row</button>
          </div>
        </div>
        <ReactDataGrid
          toolbar={<Toolbar enableFilter={true}/>}
          enableCellSelect={true}
          onAddFilter={this.handleFilterChange}
          onClearFilters={this.onClearFilters}
          scrollToRowIndex={+this.state.scrollToRowIndex}
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={this.getSize()}
          minHeight={500} />
      </div>
    )
  }
}

export default Table;
