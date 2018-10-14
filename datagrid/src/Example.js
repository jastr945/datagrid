import React from 'react';
import axios from 'axios';
import ReactDataGrid from 'react-data-grid';
import Form from "react-jsonschema-form";
import 'bootstrap/dist/css/bootstrap.css';


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


class Example extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      rows: ''
    }
    this._columns = [
      { key: 'id', name: 'ID' },
      { key: 'title', name: 'Title' },
      { key: 'content', name: 'Content' } ];

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

  rowGetter = (i) => {
    return this.state.rows[i];
  };

  submitForm = ({formData}) => {
    axios.post('http://localhost:8888/v1/buckets/default/collections/test-1/records', {"data":formData}, auth)
      .then((res) => {
        this.getData();
      })
      .catch((err) => { console.log(err); })
  }

  render() {
    return  (
      <div>
        <Form schema={schema} onSubmit={this.submitForm} />
        <ReactDataGrid
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500} />
      </div>
    )
  }
}

export default Example;
