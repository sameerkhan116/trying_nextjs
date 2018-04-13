import {Input, Checkbox, Button} from 'antd';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import withData from '../lib/apollo';

const LOGIN_MUTATION = gql `
  mutation($email : String!, $password : String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
    }
  }
`;

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value || e.target.checked
    })
  }

  onSubmit = async () => {
    const response = await this
      .props
      .mutate({variables: this.state});
    const {token, refreshToken} = response.data.login;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  render() {
    return (
      <div>
        <Input
          name='email'
          placeholder='Email'
          value={this.state.email}
          type='email'
          onChange={e => this.onChange(e)}/>
        <br/>
        <Input
          name='password'
          placeholder='Password'
          value={this.state.password}
          type='password'
          onChange={e => this.onChange(e)}/>
        <br/>
        <Button type='primary' onClick={this.onSubmit}>Submit</Button>
      </div>
    )
  }
}

const graphqlLogin = graphql(LOGIN_MUTATION)(Login);

export default withData(graphqlLogin);