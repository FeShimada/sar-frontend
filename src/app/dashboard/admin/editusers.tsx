"use client"

import AdminModal from "@/components/adminModal";
import DataTable from "@/components/datatable";
import DataTableUsers from "@/components/datatableusers";
import UserModal from "@/components/usermodal";
import { Box, Typography, Modal, Button } from '@mui/material'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    role: number;
    password: string;
}

export default function EditUsers() {

    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState({ id: 0 });
    const [modal, setModal] = useState({
        openModal: false
    })
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/user/user`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });
                const data = await res.json();

                setUsers(data);
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        };
        if (session?.user.id !== undefined) {
            fetchData();
        }
    }, [session]);

    const handleDeleteUser = async () => {
        if (selectedUser) {
            try {
                await fetch(`http://localhost:8000/user/${selectedUser.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });

                setModal({ openModal: false })

                const newUsers = users.filter(user => user.id !== selectedUser.id)
                setUsers(newUsers)
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
                        Todos os usuários
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
                        <DataTableUsers setSelectedUser={setSelectedUser} handleRowClick={() => setModal({ openModal: true })} users={users} />

                        <Button sx={{
                            marginTop: '10px',
                        height: '57px', background: 'black', color: 'white', '&:hover': {
                            background: (theme) => theme.palette.secondary.dark,
                        },
                    }}
                        variant='outlined' onClick={() => router.push('/dashboard/admin/createuser')}>Registrar</Button>
                    </Box>

                    
                </Box>
            </Box>

            <Modal
                open={modal.openModal}
                onClose={() => setModal((prev) => ({ ...prev, openModal: false }))}
            >
                <>
                    <UserModal
                        handleDelete={handleDeleteUser}
                        onClose={() => setModal((prev) => ({ ...prev, openModal: false }))}
                        selectedUser={selectedUser}
                        setUsers={setUsers}
                        users={users}
                    />
                </>
            </Modal>
        </>
    )
}
