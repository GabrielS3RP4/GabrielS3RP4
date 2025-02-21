from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Lista para armazenar os cadastros (em um caso real, seria um banco de dados)
cadastros = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    if request.method == 'POST':
        nome = request.form['nome']
        senha = request.form['senha']
        confirmar_senha = request.form['confirmar_senha']

        # Verifica se o nome de usuário já existe
        for cadastro in cadastros:
            if cadastro['nome'] == nome:
                return "O nome de usuário já está em uso. Escolha outro nome."

        # Verifica se a senha e a confirmação de senha coincidem
        if senha != confirmar_senha:
            return "As senhas não coincidem, tente novamente."

        # Adicionando o cadastro à lista (aqui é onde você salva o usuário)
        cadastros.append({'nome': nome, 'senha': senha})

        # Redireciona para a página de login após o cadastro
        return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        nome = request.form['nome']
        senha = request.form['senha']
        
        # Verifica se o usuário existe e a senha está correta
        for cadastro in cadastros:
            if cadastro['nome'] == nome and cadastro['senha'] == senha:
                # Redireciona para a página correta que exibe os usuários cadastrados
                return redirect(url_for('usuarios'))

        # Caso o login falhe
        return "Usuário ou senha incorretos. Tente novamente."

    return render_template('login.html')


@app.route('/usuarios')
def usuarios():
    # Exibe a lista de usuários cadastrados
    return render_template('usuarios.html', cadastros=cadastros)



if __name__ == '__main__':
    app.run(debug=True)
