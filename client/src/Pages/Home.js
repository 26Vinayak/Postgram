import React, { useContext} from 'react'
import {useMutation, useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {Button, Form, Grid,Placeholder,Segment,Transition} from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';
function Home() {
    const {user} = useContext(AuthContext);
    
    const {
        loading,
        data
    } = useQuery(FETCH_POSTS_QUERY);
    let posts = data?.getPosts;
    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        body:''
    });

    // eslint-disable-next-line no-unused-vars
    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
          // fetching the data from  
          const data = proxy.readQuery({
            query: FETCH_POSTS_QUERY
          });
          data.getPosts = [result.data.createPost, ...data.getPosts];
          proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
          posts = data?.getPosts;
          values.body = '';
        } 
    });
    function createPostCallback(){
        createPost();
    }
    return (
        <Grid columns={3}>
            <Grid.Row className = "page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <Form onSubmit = {onSubmit}>
                            <h2>Create a post:</h2>
                            <Form.Field>
                                <Form.Input
                                    placeholder = "Hi World!"
                                    name="body"
                                    onChange = {onChange}
                                    value={values.body}
                                    error = {error?true:false}
                                />
                                {values.body.length>0 && <Button type = "submit" color = "teal">
                                    Submit
                                </Button>
                                }
                            </Form.Field>
                        </Form>
                        {error && (
                            <div className = "ui error message" style = {{marginBottom:20}}>
                                <ul className = "list">
                                    <li>{error.graphQLErrors[0].message}</li>
                                </ul>
                            </div>
                        )}
                    </Grid.Column>
                )}
                {loading?(
                    <>
                        <Grid.Column>
                            <Segment raised>
                                <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='short' />
                                </Placeholder.Paragraph>
                                </Placeholder>
                            </Segment>
                        </Grid.Column>

                            <Grid.Column>
                            <Segment raised>
                                <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='short' />
                                </Placeholder.Paragraph>
                                </Placeholder>
                            </Segment>
                            </Grid.Column>

                            <Grid.Column>
                            <Segment raised>
                                <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='short' />
                                </Placeholder.Paragraph>
                                </Placeholder>
                            </Segment>
                        </Grid.Column>
                    </>
                ):
                <Transition.Group>
                    {(posts && posts?.map((post) => {   
                            return (<Grid.Column style={{marginBottom:20}} key = {post.id}><PostCard post = {post}/></Grid.Column>);
                    }))}
                </Transition.Group>}
            </Grid.Row>
        </Grid>
    );
}



const FETCH_POSTS_QUERY = gql`
    {
        getPosts{ 
            id 
            body 
            createdAt 
            username 
            likeCount
            likes{
                username 
            }
            commentCount
            comments{
                id 
                username 
                createdAt 
                body
            }
        }
    }
`;

const CREATE_POST_MUTATION = gql`
    mutation createPost($body:String!){
        createPost(body:$body){
            id
            body
            createdAt
            username
            likes{
                id
                username
                createdAt
            }
            likeCount
            comments{
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`;
export default Home;
