import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'

import { Context } from '../Context/AuthContext';

import { Login } from '../components/Login/Login';
import { Dashboard } from '../page/Dashboard/Dashboard';
import { ListaCategories } from '../page/Category/Category';
import { CategoryForm } from '../page/CategoryForm/CategoryForm';
import { ListaProducts } from '../page/Products/Products';
import { ProductsForm } from '../page/ProductsForm/ProductsForm';

// import { NewUser } from '../page/NewUser/NewUser';  Criar usuario pelo frontend

function CustomRoute({ isPrivate, ...rest}){

    const { authenticated } = useContext(Context);
    if( isPrivate && ! authenticated){
        return <Redirect to="/" />
    }
    return <Route { ...rest } />

}

export default function PrivateRoute(){
    return(
        <Switch>
              <CustomRoute exact path="/" component={Login} />
              {/* <CustomRoute exact path="/newuser" component={NewUser} /> */}
              <CustomRoute isPrivate path="/dashboard" component={Dashboard} />
              <CustomRoute isPrivate path="/category/novo" component={CategoryForm} />
              <CustomRoute isPrivate path="/category/editar/:id" component={CategoryForm} />
              <CustomRoute isPrivate path="/category" component={ListaCategories} />
              <CustomRoute isPrivate path="/products/novo" component={ProductsForm} />
              <CustomRoute isPrivate path="/products/editar/:id" component={ProductsForm} />
              <CustomRoute isPrivate path="/products" component={ListaProducts} />
        </Switch>
    )
}