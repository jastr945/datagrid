import React from 'react';
import axios from 'axios';
import ReactDataGrid from 'react-data-grid';
import 'bootstrap/dist/css/bootstrap.css';


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
    axios.get('http://localhost:8888/v1/buckets/default/collections/test-1/records', {
      auth: {
        username: {process.env.KINTO_USER},
        password: {process.env.KINTO_PASSWORD}
      }
    })
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

  render() {
    return  (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={500} />);
  }
}

export default Example;
