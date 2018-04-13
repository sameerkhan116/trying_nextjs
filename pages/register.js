import {Input, Checkbox, Button} from 'antd';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/apollo';

const REGISTER_MUTATION = gql `
  mutation($username : String !, $email : String !, $password : String !, $isAdmin : Boolean!) {
    register(username : $username, email : $email, password : $password, isAdmin : $isAdmin) {
      id
    }
  }
`;

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    isAdmin: false
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value || e.target.checked
    })
  }

  onSubmit = () => {
    this
      .props
      .mutate({variables: this.state})
      .then(({data}) => console.log(data));
  }

  render() {
    return (
      <div>
        <Input
          name='username'
          placeholder='Username'
          value={this.state.username}
          onChange={e => this.onChange(e)}/>
        <Input
          name='email'
          placeholder='Email'
          value={this.state.email}
          type='email'
          onChange={e => this.onChange(e)}/>
        <Input
          name='password'
          placeholder='Password'
          value={this.state.password}
          type='password'
          onChange={e => this.onChange(e)}/>
        <Checkbox
          name='isAdmin'
          checked={this.state.isAdmin}
          onChange={e => this.onChange(e)}>Admin?</Checkbox>
        <Button type='primary' onClick={() => this.onSubmit()}>Submit</Button>
      </div>
    )
  }
}

const graphqlRegister = graphql(REGISTER_MUTATION)(Register);

export default withData(graphqlRegister);