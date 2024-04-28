
import { Box, Button, Grid, Autocomplete, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface ModalCardPropType {
    handleDelete: () => void;
    onClose: () => void;
    selectedUser: {
        id: number;
    }
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
    users: User[]
}

interface User {
    id: number;
    name: string;
    email: string;
    role: number;
    password: string;
}

export default function UserModal(props: ModalCardPropType) {

    const { handleDelete, onClose, selectedUser, setUsers, users } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [selectedUserObject, setSelectedUserObject] = useState<User>({ id: 0, name: '', email: '', role: 0 } as User);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/user/${selectedUser.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });
                const data = await res.json();
                setSelectedUserObject(data);
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        };

        fetchData();
    }, [])

    const handleSubmit = async () => {

        try {
            const res = await fetch("http://localhost:8000/user/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${session?.backendTokens.accessToken}`,
                },
                body: JSON.stringify(selectedUserObject),
            });
            if (res.ok) {
                const updatedUser = await res.json();
                const updatedIndex = users.findIndex(user => user.id === updatedUser.id);
                if (updatedIndex !== -1) {
                    const newUsers = [...users];
                    newUsers[updatedIndex] = updatedUser;
                    setUsers(newUsers);
                }
            } else {
                console.error("Erro ao atualizar usuário:", res.statusText);
            }

        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
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
            {!isEditing ? (
                <>
                    <Button
                        onClick={handleDelete}
                        sx={{ width: '100% !important', height: '100% important', margin: '0px !important' }}
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        variant="outlined"
                    >Excluir</Button>
                    <Button
                        onClick={() => setIsEditing(true)}
                        sx={{ width: '100% !important', height: '100% important', margin: '0px !important' }}
                        variant="outlined"
                    >Editar</Button>
                </>
            ) : (
                <>
                    <Box
                        sx={{
                            padding: '100px 25px 135px 25px',
                        }}
                    >
                        <Box
                            sx={{
                                border: '0.5px solid #878787',
                                boxShadow: '0px 4px 64px rgba(0, 0, 0, 0.05)',
                                borderRadius: '10px',
                                padding: '133px 41px'

                            }}
                        >
                            <Typography variant='h3' sx={{ fontWeight: 500, marginBottom: '27px' }}>Editar</Typography>
                            <Grid container sx={{ gap: '16px' }}>
                                <Grid item sm={12} sx={{ width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        label='Nome'
                                        variant={'outlined'}
                                        value={selectedUserObject.name}
                                        onChange={(e) => setSelectedUserObject((prev) => ({ ...prev, name: e.target.value }))}
                                        name='name'
                                    />
                                </Grid>

                                <Grid item sm={12} sx={{ width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        label='E-mail'
                                        variant={'outlined'}
                                        value={selectedUserObject.email}
                                        onChange={(e) => setSelectedUserObject((prev) => ({ ...prev, email: e.target.value }))}
                                        name='email'
                                    />
                                </Grid>
                                <Grid item sm={12} sx={{ width: '100%' }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={selectedUserObject.role}
                                            label="Role"
                                            onChange={(e) => setSelectedUserObject((prev: any) => ({ ...prev, role: e.target.value }))}
                                        >
                                            <MenuItem value={0}>Autor</MenuItem>
                                            <MenuItem value={1}>Avaliador</MenuItem>
                                            <MenuItem value={2}>Administrador</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item sm={12} sx={{ width: '100%' }}>
                                    <Button
                                        fullWidth
                                        sx={{ height: '57px', background: 'black', color: 'white', }}
                                        variant='outlined'
                                        type="button"
                                        onClick={handleSubmit}
                                    >Salvar</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>

                </>
            )}
        </Box>
    )
} 
