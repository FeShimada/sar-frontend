"use client"

import AdminModal from "@/components/adminModal";
import DataTable from "@/components/datatable";
import { Box, Typography, Modal } from '@mui/material'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Article {
    id: number;
    title: string;
    summary: string;
    pdfLink: string;
    status: number;
    score1: null | number;
    score2: null | number;
}

export default function ViewAllArticle() {

    const { data: session } = useSession();
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState({id: 0});
    const [ modal, setModal ] = useState({
        openModal: false
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/article/getall/article`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });
                const data = await res.json();

                setArticles(data.map((article: any) => {
                    let newArticle = { ...article, media: ((article.score1 + article.score2) / 2) }
                    return newArticle
                }));
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        };
        if (session?.user.id !== undefined) {
            fetchData();
        }
    }, [session]);

    const handleDeleteArticle = async () => {
        if(selectedArticle) {
            try {
                await fetch(`http://localhost:8000/article/${selectedArticle.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });

                setModal({openModal: false})

                const newArticles = articles.filter(article => article.id !== selectedArticle.id)
                setArticles(newArticles)
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        }
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '50%'
                }}
            >
                <Box
                    sx={{
                        padding: '22px 0px 89px 0px',
                        width: '1009px'
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        color={(theme) => theme.palette.primary.main}
                    >
                        Todos os artigos
                    </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            background: 'white',
                            padding: '24px 28px 38px 28px',
                            borderRadius: '8px',
                            marginTop: '26px'
                        }}
                    >
                        <DataTable setSelectedArticle={setSelectedArticle} handleRowClick={() => setModal({openModal: true})} articles={articles} />
                    </Box>
                </Box>
            </Box>

            <Modal
                open={modal.openModal}
                onClose={() => setModal((prev) => ({ ...prev, openModal: false }))}
            >
                <>
                    <AdminModal
                        handleDelete={handleDeleteArticle}
                        onClose={() => setModal((prev) => ({ ...prev, openModal: false }))}
                        selectedArticle={selectedArticle}
                    />
                </>
            </Modal>
        </>
    )
}
