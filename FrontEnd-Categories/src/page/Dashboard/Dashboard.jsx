import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import { Context } from '../../Context/AuthContext';
import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';

export const Dashboard = () => {
    const token = localStorage.getItem('token');

    const { authenticated, handleLogout } = useContext(Context);

    console.log(`Situação do usuário na página Dashboard: ${authenticated}`);

    return(
        <div>

      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/dashboard">Menu Bala</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/category">Category</Nav.Link>
          </Nav>
          <Form>
          <Button variant="outline-warning" type="button" onClick={handleLogout}>Sair</Button>
          </Form>
        </Container>
      </Navbar>
            <h1>Dashboard</h1>
            {/* <h6>Token: {token}</h6> */}
        </div>
    )
}