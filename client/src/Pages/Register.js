import React, { useContext, useState } from 'react'
import {Button, Form} from 'semantic-ui-react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {useForm} from '../utils/hooks';
import { AuthContext } from '../context/auth';

function Register(props) {
    const [errors,setErrors] = useState({});
    const context = useContext(AuthContext);
    const {onChange,onSubmit,values} = useForm(registerUser,{
        username:'',
        email:'',
        password:'',
        confirmPassword:''     
    });
    const [addUser,{loading}] = useMutation(REGISTER_USER,{
        update(_,{data:{register:userData}}){
            console.log(userData);
            context.login(userData);
            props.history.push('/');
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables:values
    });
    function registerUser(){
        addUser();
    }
    return (
        <div className = "form-container">
            <Form onSubmit = {onSubmit} noValidate  className = {loading?"loading":''}>
                <h1>Register</h1>
                <Form.Input
                    type = "text"
                    label = "Username"
                    placeholder="Username..."
                    name = "username"
                    value = {values.username}
                    error = {errors.username?true:false}
                    onChange = {onChange}
                />
                <Form.Input
                    type = "email"
                    label = "Email"
                    placeholder="Email..."
                    name = "email"
                    error = {errors.email?true:false}
                    value = {values.email}
                    onChange = {onChange}
                /><Form.Input
                    label = "Password"
                    placeholder="Password..."
                    name = "password"
                    type = "password"
                    error = {errors.password?true:false}
                    value = {values.password}
                    onChange = {onChange}
                /><Form.Input
                    type = "password"
                    label = "Confirm Password"
                    placeholder="Confirm Password..."
                    error = {errors.confirmPassword?true:false}
                    name = "confirmPassword"
                    value = {values.confirmPassword}
                    onChange = {onChange}
                />
                <Button type = 'submit' primary>
                    Register
                </Button>
            </Form>
            {Object.keys(errors).length>0 && (
                <div className = "ui error message">
                    <ul className = "list">
                        {Object.values(errors).map(value =>(
                            <li key = {value}>{value}</li>
                        ))}
                    </ul>
                </div>

            )}
        </div>
    );
}


const REGISTER_USER = gql`
    mutation register(
        $username:String!
        $email:String!
        $password:String!
        $confirmPassword:String!
    ){
        register(
            registerInput:{
                username:$username
                email:$email
                password:$password
                confirmPassword:$confirmPassword
            }
        ){
            id
            email
            username
            createdAt
            token
        }
    }
`;

export default Register;
