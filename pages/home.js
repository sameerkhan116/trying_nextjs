export default class Home extends React.Component {
  static async getInitialProps({query}) {
    return {query};
  }

  componentDidMount() {
    const {token, refreshToken} = this.props.query;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  render() {
    return (
      <h1>Home page</h1>
    )
  }
}