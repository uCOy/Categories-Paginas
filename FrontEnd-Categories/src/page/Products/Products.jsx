import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Context } from '../../Context/AuthContext';
import Table from 'react-bootstrap/Table';
import './Products.css'
import { confirmAlert } from 'react-confirm-alert';
import { useHistory } from 'react-router-dom';

import { Nav, Navbar, Container, Button, Form } from 'react-bootstrap';

export const ListaProducts = () => {

    const history = useHistory();

    const [data, setData] = useState([]);
    const [page, setPage] = useState();
    const [lastPage, setLastPage] = useState("")

    const { authenticated, handleLogout } = useContext(Context);

    const [status, setStatus] = useState({
        type:'',
        mensagem:''
    })

    const confirmDelete = (products) => {
        confirmAlert({
          title: "CAUTION !!!!",
          message:
            "Are you absolutely sure you want to delete section " +
            products.id +
            "?",
          buttons: [
            {
              label: "Yes",
              onClick: () => handleDelete(products.id)
            },
            {
              label: "No",
              onClick: () => history.push("/products")
            }
          ]
        });
      };

    const handleDelete = async (idProducts) => {
        console.log(idProducts);

        const valueToken = localStorage.getItem('token');
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + valueToken
            }
        }

        await api.delete("/products/delete/"+idProducts, headers)
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

    const getProducts = async (page) => {

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

        await api.get("/products/all/pages/" + page, headers)
            .then( (response) => {
                setData(response.data.products);
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
        getProducts();
    }, [])

    return(
        <div>
            <Navbar bg="dark" variant="dark">
              <Container>
                <Navbar.Brand href="/dashboard">Menu Bala</Navbar.Brand>
                <Nav className="me-auto">
                  <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link href="/category">Category</Nav.Link>
                  <Nav.Link href="/products">Products</Nav.Link>
                </Nav>
                <Form>
                <Button variant="outline-warning" type="button" onClick={handleLogout}>Sair</Button>
                </Form>
              </Container>
            </Navbar>
            
            <h1 className="userCenter">Produtos</h1>

            <div className="buttonDiv">
                <Button className="buttonNew" variant="outline-success" href="/products/novo">Novo Produto</Button>{' '}
            </div>
            <div className="table">
                <Table striped bordered hover>
                    <tbody>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>CategorieId</th>
                    </tr>
                    {(!status.loading &&
                    data.map(products => (
                        <tr key={products.id}>
                            <td>{products.id}</td>
                            <td>{products.name}</td>
                            <td>{products.description}</td>
                            <td>{products.quantity}</td>
                            <td>{products.price}</td>
                            <td>{products.categorieId}</td>
                            <td className="spaceFlex">
                            <Button className="noLink" variant="outline-warning">
                                <Link className="onLink" to={"/products/editar/"+products.id}>Editar</Link>
                            </Button>
                            <Button variant="outline-danger" onClick={() => confirmDelete(products)}>
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
                ? <Button type="button" onClick={ () => getProducts(1)}>Primeira</Button>
                : <Button type="button" disabled>Primeira</Button>
            }{" "}
            
            {/* antes da pagina que o usuario está */}
            { page !== 1
                ? <Button type="button" onClick={ () => getProducts(page - 1)}>{page - 1}</Button>
                : ""
            }{" "}

            {/* Página Atual */}
            <Button type="button" disabled>{page}</Button>{" "}

            {/* página depois da atual */}
            { page !== lastPage
                ? <Button type="button" onClick={ () => getProducts(page + 1)}>{page + 1}</Button>
                : ""
            }{" "}
            {/* { page + 1 <= lastPage
                ? <Button type="button" onClick={ () => getProducts(page + 1)}>{page + 1}</Button>
                : ""
            }{" "} */}

            {/* Ultima Página */}
            { page !== lastPage 
                ? <Button type="button" onClick={ () => getProducts(lastPage)}>Ultima</Button>
                : <Button type="button" disabled>Ultima</Button>
            }
            </div>
        </div>
    )
}