import React, { useState, useContext } from "react";
import Alert from 'react-bootstrap/Alert';
import { Container } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './styles.css';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';

import { Context } from '../../Context/AuthContext';

export function Login() {
  const history = useHistory();  

  const { authenticated, singIn } = useContext(Context);
  console.log(`Situação do usuário na página Login: ${authenticated}`);

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const [status, setStatus] = useState({
    type: '',
    mensagem: '',
    loading: false
  })

  const valorInput = e => setUser({ 
    ...user, 
    [e.target.name]: e.target.value
  })

  const loginSubmit = async e => {

    e.preventDefault();

    // console.log(user.email);
    // console.log(user.password);
    
    setStatus({
      loading:true,
    })

    const headers = {
      'Content-Type': 'application/json'
      // 'Content-Type':'application/x-www-form-urlencoded'
    }

    await api.post("/users/login", user, {headers})
    .then((response) => {
      // console.log(response);
      setStatus({
        type: 'success',
        mensagem: response.data.mensagem
      })

      localStorage.setItem('token', (response.data.token));

      singIn(true);
      
      return history.push('/dashboard');

    }).catch((err) => {
      setStatus({
          type: 'error',
          mensagem: 'Erro: tente mais tarde...'
      })
      if(err.response){
        // console.log(err.response);
        setStatus({
          type: 'error',
          mensagem: err.response.data.mensagem,
          loading: false
        })
      }
      // console.log("Erro: tente mais tarde...");  
    })
  }
    return(
        <div className="background">
          <Container className="box">
              <Form onSubmit={loginSubmit} className="borderForm">
                {/* {status.type == 'error' ? <p>{status.mensagem}</p>: ""} */}
                {/* {status.type == 'success' ? <p>{status.mensagem}</p>: ""} */}
                {[
        'success',
      ].map((variant) => (
        <p>
          {status.type == 'success' ? 
          <Alert key={variant} variant={variant}>{status.mensagem}</Alert>: ""}
        </p>
      ))}
      {[
        'danger',
      ].map((variant) => (
        <p>
          {status.type == 'error' ? 
          <Alert key={variant} variant={variant}>{status.mensagem}</Alert>: ""}
        </p>
      ))}
      {[
        'warning'
      ].map((variant) => (
        <p>
          {status.loading ?
        <Alert key={variant} variant={variant}> Validando... </Alert> : ""}
        </p>
      ))}
                
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name="email" onChange={valorInput} placeholder="Enter email" />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    {/* Nunca compartilharemos seu e-mail com mais ninguém */}
                  </Form.Text>
                </Form.Group>
      
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" onChange={valorInput} placeholder="Password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                {status.loading ? <Button id="button" variant="primary" disabled type="submit" >Acessando...</Button>
                : <Button id="button" variant="primary" type="submit" >Acessar</Button>}
                {/* <Button className="btn-user" variant="primary">
                  <Link className="obtn-user" to={"/newuser"}>Criar Usuário</Link>
                </Button> */}
                
              </Form>
          </Container>
        </div>
    )

}