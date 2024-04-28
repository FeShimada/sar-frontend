
import { Box, Button, Grid, Autocomplete, TextField, Typography, List, ListItem, ListItemText } from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface ModalCardPropType {
    handleDelete: () => void;
    onClose: () => void;
    selectedArticle: {
        id: number;
    }
}

interface Measurer {
    id: number;
    name: string;
    email: string;
    role: number;
    password?: string;
}

export default function AdminModal(props: ModalCardPropType) {

    const { handleDelete, onClose, selectedArticle } = props;
    const [assignForEval, setAssignForEval] = useState(false);
    const [selectedMeasurer, setSelectedMeasurer] = useState<Measurer>({ id: 0, name: '', email: '', role: 0 } as Measurer);
    const [selectedMeasurerList, setSelectedMeasurerList] = useState<Measurer[]>([]);
    const [measurers, setMeasurers] = useState<Measurer[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/user/measurer", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });
                const data = await res.json();
                setMeasurers(data);
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }

            try {
                const res = await fetch(`http://localhost:8000/article/${selectedArticle.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });
                const data = await res.json();
                setSelectedMeasurerList(data.authors.filter((author: any) => author.role === 1));
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        };

        fetchData();
    }, [])

    const handleSubmit = async () => {
        selectedMeasurerList.forEach(async (selectedMeasurer) => {

            const { id } = selectedMeasurer

            try {
                await fetch("http://localhost:8000/user/assign-article-to-measurer", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    },
                    body: JSON.stringify({
                        id,
                        articles: [{id: selectedArticle.id}]
                    }),
                });

            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        })
        onClose();
    }

    return (

        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            backgroundColor: 'white',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '24px 16px',
            gap: '16px',
        }}>
            {!assignForEval ? (
                <>
                    <Button
                        onClick={handleDelete}
                        sx={{ width: '100% !important', height: '100% important', margin: '0px !important' }}
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        variant="outlined"
                    >Excluir</Button>
                    <Button
                        onClick={() => setAssignForEval(true)}
                        sx={{ width: '100% !important', height: '100% important', margin: '0px !important' }}
                        variant="outlined"
                    >ASSIGN ARTICLE FOR EVALUATE</Button>
                </>
            ) : (
                <>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <Grid container>
                            <Grid item xs={7}>
                                <Autocomplete
                                    value={selectedMeasurer}
                                    options={measurers}
                                    renderInput={(params) => <TextField {...params} label="Avaliador" />}
                                    disablePortal
                                    getOptionLabel={(option) => option.name}
                                    onChange={(event: any, newValue) => {
                                        if (newValue) setSelectedMeasurer(newValue);
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            onClick={() => {
                                if (selectedMeasurer) {
                                    setSelectedMeasurerList((prevMeasurers) => [...prevMeasurers, selectedMeasurer]);
                                }
                            }}
                            sx={{ width: '100px !important', height: '100% important', margin: '0px !important' }}
                            variant="outlined"
                        >Adicionar</Button>
                    </Box>

                    <Typography>Avaliadores selecionados:</Typography>

                    <List>
                        {selectedMeasurerList.map((selectedMeasurer, i) => (
                            <ListItem disablePadding key={i}>
                                <ListItemText primary={<Typography>{selectedMeasurer.name}</Typography>} />
                            </ListItem>
                        ))}
                    </List>

                    <Button
                        onClick={handleSubmit}
                        sx={{ width: '100% !important', height: '100% important', margin: '0px !important' }}
                        variant="outlined"
                    >Concluir</Button>
                </>
            )}
        </Box>
    )
} 
