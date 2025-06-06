import React, { useState } from 'react';
import './CadastroUsuario.css';

function CadastroUsuario() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        dataNascimento: '',
        senha: '',
        foto: null
    });

    const [showPassword, setShowPassword] = useState(false);

    const [preview, setPreview] = useState(null); // estado da imagem

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files[0]) {
            setForm({...form, [name]: files[0] });

            // Gera a URL de visualização
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(files[0]);
        } else {
            setForm({...form, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cadastro enviado (simulado)');
    };

    return ( <
        div className = "cadastro-wrapper" > {
            preview && ( <
                div className = "preview-container" >
                <
                img src = { preview }
                alt = "Preview"
                className = "profile-preview" / >
                <
                /div>
            )
        }

        <
        form className = "cadastro-container"
        onSubmit = { handleSubmit } >
        <
        h2 > Cadastro de Usuário < /h2>

        <
        label > Nome de usuário < /label> <
        input type = "text"
        name = "username"
        value = { form.username }
        onChange = { handleChange }
        required / >

        <
        label > E - mail < /label> <
        input type = "email"
        name = "email"
        value = { form.email }
        onChange = { handleChange }
        required / >

        <
        label > Data de nascimento < /label> <
        input type = "date"
        name = "dataNascimento"
        value = { form.dataNascimento }
        onChange = { handleChange }
        required / >

        <
        label > Senha < /label> <
        div className = "senha-wrapper" >
        <
        input type = { showPassword ? 'text' : 'password' }
        name = "senha"
        value = { form.senha }
        onChange = { handleChange }
        required /
        >
        <
        button type = "button"
        className = "senha-toggle"
        onClick = {
            () => setShowPassword(!showPassword)
        } > { showPassword ? '🙈' : '👁️' } <
        /button> < /
        div >



        <
        label > Foto de perfil < /label> <
        input type = "file"
        name = "foto"
        accept = "image/*"
        onChange = { handleChange }
        />

        <
        button type = "submit" > Cadastrar < /button> < /
        form > <
        /div>
    );
}

export default CadastroUsuario;