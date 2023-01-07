import Layout from "./Layout";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import { Route, Routes , useNavigate} from 'react-router-dom'
import { useState, useEffect } from "react";
import { format } from 'date-fns'
import api from './api/posts';
import EditPost from './EditPost'

function App() {
    const [posts, setPost] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResults] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get('/post');
                setPost(response.data);
            } catch (error) {
                if (error.response) {
                    console.log(error.response.data)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                } else {
                    console.log(`Error: ${error.message}`)
                }
            }
        }
        fetchPost();
    },[])

    useEffect(() => {
        const filteredResults = posts.filter(post =>
                ((post.body).toLowerCase()).includes(search.toLowerCase())
                || ((post.title).toLowerCase()).includes(search.toLowerCase()));
        setSearchResults(filteredResults.reverse())
    },[posts, search])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const newPost = { id, title: postTitle, datetime, body: postBody };
        try {
            const response = await api.post('/post', newPost);
            const allPosts = [...posts, response.data];
            setPost(allPosts);
            setPostTitle('');
            setPostBody('');
            navigate('/');
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    const handleEdit = async (id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const updatedPost = { id, title: editTitle, datetime, body: editBody };
        try {
            const response = await api.put(`/post/${id}`, updatedPost);
            setPost(posts.map(post => post.id === id ? {...response.data} : post));
            setEditBody('');
            setEditTitle('');
            navigate('/');
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`/post/${id}`);
            const postList = posts.filter(post => post.id !== id);
            setPost(postList);
            navigate('/');
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    return (
        <Routes>
            <Route path="/" element={<Layout
                search={search}
                setSearch={setSearch}
            />}>
                <Route index element={<Home posts={searchResult} />} />
                <Route path="post">
                    <Route index element={< NewPost
                        handleSubmit={handleSubmit}
                        postTitle={postTitle}
                        setPostTitle={setPostTitle}
                        postBody={postBody}
                        setPostBody={setPostBody}
                    />} />       

                <Route path="/post/:id" element={<PostPage 
                    posts={posts} 
                    handleDelete={handleDelete}
                />} />
                </Route>
                <Route path="/edit/:id" element={< EditPost
                    posts={posts}
                    handleEdit={handleEdit}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    editBody={editBody}
                    setEditBody={setEditBody}
                />} />  

                <Route path="about" element={<About />}/>
                <Route path="*" element={<Missing />}/>
            </Route>
        </Routes>
            
    );
}

export default App;
