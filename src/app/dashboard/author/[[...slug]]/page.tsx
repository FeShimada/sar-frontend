
"use client"

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, TextField, Autocomplete, List, ListItem } from '@mui/material'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter as teste } from 'next/router';


interface Author {
    id: number;
    name: string;
    email: string;
    role: number;
    password?: string;
}

export default function EditarArtigo() {

    const pathname = usePathname();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [authors, setAuthors] = useState<Author[]>([])
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])
    const { data: session } = useSession();
    const [selectedAuthor, setSelectedAuthor] = useState<Author>({ id: 0, name: '', email: '', role: 0 } as Author)
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [link, setLink] = useState('')
    const router = useRouter()

    const getIdFromURL = () => {
        const url = window.location.href;
        const idIndex = url.lastIndexOf('id:') + 3; 
        const id = url.substring(idIndex);
        return parseInt(id);
    };
    
    const idTest = getIdFromURL();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/user/author", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });
                const data = await res.json();
                setAuthors(data)
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        };

        if (idTest !== null && idTest !== undefined && !Number.isNaN(idTest)) {
            const fetchArticleData = async () => {
                try {
                    const res = await fetch("http://localhost:8000/article/" + idTest, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${session?.backendTokens.accessToken}`,
                        }
                    });
                    const data = await res.json();
                    setTitle(data.title)
                    setSummary(data.summary)
                    setLink(data.pdfLink)
                    setSelectedAuthors(data.authors)
                } catch (error) {
                    console.error('Erro ao buscar os dados do artigo:', error);
                }
            };
    
            if (session?.user.id !== undefined) {
                fetchArticleData();
            }
        }

        if (session?.user.id !== undefined) {
            fetchData();
        }
    }, [session, idTest])


    const getId = () => {
        const regex = /\/id:(\d+)/;
        const match = pathname.match(regex);

        if (match) {
            return parseInt(match[1]);
        } else {
            return null;
        }
    }

    const [id, setId] = useState(getId())

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (file) {
                setLink(URL.createObjectURL(file))
            }
        }
    };

    const handleSelectFileClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };


    const handleSubmit = () => {
        const selectedAuthorIds = selectedAuthors.map(author => ({ id: author.id }));

        const obj = {
            title: title,
            summary: summary,
            pdfLink: link,
            authors: selectedAuthorIds
        }

        if(idTest) {

            const newObj = {...obj, id: idTest}

            const fetchData = async () => {
                try {
                    await fetch("http://localhost:8000/article/edit/author", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${session?.backendTokens.accessToken}`,
                        },
                        body: JSON.stringify(newObj)
                    });
                    router.back()
                } catch (error) {
                    console.error('Erro ao salvar os dados:', error);
                }
            };
    
            if (session?.user.id !== undefined) {
                fetchData();
            }

        } else {
            const fetchData = async () => {
                try {
                    await fetch("http://localhost:8000/article/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${session?.backendTokens.accessToken}`,
                        },
                        body: JSON.stringify(obj)
                    });
                    router.back()
                } catch (error) {
                    console.error('Erro ao salvar os dados:', error);
                }
            };
    
            if (session?.user.id !== undefined) {
                fetchData();
            }
        }

    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <Box
                sx={{
                    minHeight: '50vh',
                    padding: '50px 150px',
                    background: 'white',
                    width: '70%',
                    alignSelf: 'center'
                }}
            >
                <Grid container
                    sx={{
                        gap: '20px'
                    }}
                >
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label='Título'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label='Resumo'
                            rows={3}
                            multiline
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    </Grid>

                    <input
                        style={{
                            display: 'none'
                        }}
                        type="file"
                        onChange={(e) => handleFileChange(e)}
                        ref={inputRef}
                    />
                    <Grid item xs={12}>
                        <Button onClick={handleSelectFileClick}>Selecionar PDF</Button>
                        {link ? (
                            <Link href={link}>PDF LINK</Link>
                        ) : (null)}
                    </Grid>

                    <Grid item xs={10}>
                        <Autocomplete
                            value={selectedAuthor}
                            options={authors}
                            renderInput={(params) => <TextField {...params} label="Autores" />}
                            disablePortal
                            getOptionLabel={(option) => option.name}
                            onChange={(event: any, newValue) => {
                                if (newValue) setSelectedAuthor(newValue);
                            }}
                        />
                    </Grid>

                    <Grid item xs={1}>
                        <Button
                            onClick={() => {
                                if (selectedAuthor) {
                                    setSelectedAuthors(prevAuthors => [...prevAuthors, selectedAuthor]);
                                }
                            }}
                            sx={{
                                background: 'black',
                                color: 'white',
                                padding: '10px',
                                height: '100%',
                                '&:hover': {
                                    background: (theme) => theme.palette.secondary.dark,
                                },
                            }}
                            fullWidth
                        >Adicionar</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <List>
                            {selectedAuthors.map((author) => (
                                <ListItem key={author.id}>
                                    {author.name}
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Box>

            <Button
                onClick={handleSubmit}
                sx={{
                    background: 'black',
                    color: 'white',
                    padding: '10px',
                    height: '100%',
                    width: '30%',
                    alignSelf: 'center',
                    '&:hover': {
                        background: (theme) => theme.palette.secondary.dark,
                    },
                }}
            >Finalizar</Button>
        </Box>
    )
}

