import React, { useEffect, useState } from 'react'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';


function LikeButton({post:{id,likeCount,likes},user}) {    
    const [error, setErrors] = useState('');
    const [liked,setLiked] = useState(false);

    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
          setLiked(true);
        } else setLiked(false);
      }, [user, likes]);


    const [likePost] = useMutation(LIKE_POST_MUTATION,{
        variables:{postId:id},
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        }
    });
     const likeButton = user ? (
        liked ? (
        <Button color="pink">
                <Icon name="heart" />
            </Button>
            ) : (
            <Popup content = "Like on post"
              inverted
              trigger = {
                <Button color="pink" basic>
                  <Icon name="heart" />
                </Button>
              } 
            />  
            )
        ) : (
          <Popup content = "Like on post"
            inverted
            trigger = {
              <Button as={Link} to="/login" color="pink" basic>
               <Icon name="heart" />
             </Button>
            }
          />
        );
    return (
        <Button as='div' labelPosition='right' onClick = {likePost}>
              {likeButton}
              <Label as='a' basic color='pink' pointing='left'>
                {likeCount}
              </Label>
        </Button>
    )
}



const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;


export default LikeButton
