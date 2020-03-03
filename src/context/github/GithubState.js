import React, { useReducer } from 'react'
import { GithubContext } from './githubContext'
import { githubReducer } from './githubReducer'
import { SEARCH_USER, GET_USER, GET_REPOS, CLEAR_USERS, SET_LOADING } from '../types'
import axios from 'axios'

const CLIENT_ID = 'b0496b233248f5c92a81'  //process.env.REACT_APP_CLIENT_ID 
const CLIENT_SECRET = '6a4517ebfb4b881772d4c9395fe045b9262833c1'  //process.env.REACT_APP_CLIENT_SECRET

const withCreds = url => {
    return `${url}client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
}

export const GithubState = ({children}) => {
    const initialState = {
        user: {},
        users: [],
        loading: false,
        repos: []
    }
    const [state, dispatch] = useReducer(githubReducer, initialState)

    const search = async value => {
        setLoading()
        
        const response = await axios.get( 
            withCreds(`https://api.github.com/search/users?q=${value}&`)
        )

        dispatch({
            type: SEARCH_USER,
            payload: response.data.items
        })
    }

    const getUser = async name => {
        setLoading()
        
        const response = await axios.get(
            withCreds(`https://api.github.com/users/${name}?`)
        )

        dispatch({
            type: GET_USER,
            payload: response.data
        })
    }

    const getRepos = async name => {
        setLoading()
        
        const response = await axios.get(
            withCreds(`https://api.github.com/users/${name}/repos?per_page=5&`)
        )

        dispatch({
            type: GET_REPOS,
            payload: response.data
        })
    }

    const clearUsers = () => dispatch({type: CLEAR_USERS})

    const setLoading = () => dispatch({type: SET_LOADING})

    const {user, users, repos, loading} = state
    
    return (
        <GithubContext.Provider value={{
            setLoading, clearUsers, search, getUser, getRepos,
            user, users, repos, loading
        }}>
            {children}
        </GithubContext.Provider>
    )
}