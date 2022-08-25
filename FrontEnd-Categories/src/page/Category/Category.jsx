import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Context } from '../../Context/AuthContext';
import Table from 'react-bootstrap/Table';
import './category.css'
import { confirmAlert } from 'react-confirm-alert';
import { useHistory } from 'react-router-dom';

import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';

export const ListaCategories = () => {

    const history = useHistory();

    const [data, setData] = useState([]);
    const [page, setPage] = useState();
    const [lastPage, setLastPage] = useState("")

    const { authenticated, handleLogout } = useContext(Context);

    const [status, setStatus] = useState({
        type:'',
        mensagem:''
    })

    const confirmDelete = (categories) => {
        confirmAlert({
          title: "CAUTION !!!!",
          message:
            "Are you absolutely sure you want to delete section " +
            categories.id +
            "?",
          buttons: [
            {
              label: "Yes",
              onClick: () => handleDelete(categories.id)
            },
            {
              label: "No",
              onClick: () => history.push("/category")
            }
          ]
        });
      };

    const handleDelete = async (idCategories) => {
        console.log(idCategories);

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.delete("/categories/delete/"+idCategories, headers)
        .then( (response) => {
            setStatus({
                type: 'sucess',
                mensagem: response.data.mensagem
            })
            getUsers();
        }).catch( (err) => {
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem
                })
            } else {
                setStatus({
                    type:'error',
                    mensagem: 'Erro: tente mais tarde...'
                })
            }
        })
    }

    const getCategories = async (page) => {

        if( page === undefined ) {
            page = 1
        }
        setPage(page);

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.get("/categories/all/pages/" + page, headers)
            .then( (response) => {
                setData(response.data.categories);
                setLastPage(response.data.lastPage);
                setStatus({loading: false})
            }).catch( (err) => {
                if(err.response){
                    setStatus({
                        type:'error',
                        mensagem: err.response.data.mensagem
                    })
                } else {
                    setStatus({
                        type:'error',
                        mensagem: 'Erro: tente mais tarde...'
                    })
                }
            })
    }

    useEffect( () => {
        getCategories();
    }, [])

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
            
            <h1 className="userCenter">Categorias</h1>

            <div className="buttonDiv">
                <Button className="buttonNew" variant="outline-success" href="/category/novo">Nova Categoria</Button>{' '}
            </div>
            <div className="table">
                <Table striped bordered hover>
                    <tbody>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Description</th>
                    </tr>
                    {(!status.loading &&
                    data.map(categories => (
                        <tr key={categories.id}>
                            <td>{categories.id}</td>
                            <td>{categories.name}</td>
                            <td>{categories.description}</td>
                            <td className="spaceFlex">
                            <Button className="noLink" variant="outline-warning">
                                <Link className="onLink" to={"/category/editar/"+categories.id}>Editar</Link>
                            </Button>
                            <Button variant="outline-danger" onClick={() => confirmDelete(categories)}>
                                Excluir
                            </Button>
                            </td>
                        </tr> 
                    ))
                    )}          
                    </tbody>
                </Table>
            </div>
            <div className="Container">
            { page !== 1
                ? <Button type="button" onClick={ () => getCategories(1)}>Primeira</Button>
                : <Button type="button" disabled>Primeira</Button>
            }{" "}
            
            {/* antes da pagina que o usuario está */}
            { page !== 1
                ? <Button type="button" onClick={ () => getCategories(page - 1)}>{page - 1}</Button>
                : ""
            }{" "}

            {/* Página Atual */}
            <Button type="button" disabled>{page}</Button>{" "}

            {/* página depois da atual */}
            { page !== lastPage
                ? <Button type="button" onClick={ () => getCategories(page + 1)}>{page + 1}</Button>
                : ""
            }{" "}
            {/* { page + 1 <= lastPage
                ? <Button type="button" onClick={ () => getCategories(page + 1)}>{page + 1}</Button>
                : ""
            }{" "} */}

            {/* Ultima Página */}
            { page !== lastPage 
                ? <Button type="button" onClick={ () => getCategories(lastPage)}>Ultima</Button>
                : <Button type="button" disabled>Ultima</Button>
            }
            </div>
        </div>
    )
}