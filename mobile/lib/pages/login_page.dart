import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  void loginUser(){

  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: Text('Login')
      ),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(height: 40),

              Icon(
                Icons.account_circle,
                size: 100,
                color: Colors.blue,
              ),

              SizedBox(height: 10),

              AuthTextFields(
                controller: emailController,
                hintText: 'Email',
                obscureText: false,
                icon: Icons.email,
              ),

              SizedBox(height: 10),

              AuthTextFields(
                controller: passwordController,
                hintText: 'Password',
                obscureText: true,
                icon: Icons.lock,
              ),

              SizedBox(
                height: 60
              ),

              AuthButton(
                onTap: loginUser,
                label: 'Login'
              ),

              SizedBox(height: 35),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Need an account?',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 16,
                    ),
                  ),

                  const SizedBox(width: 4),

                  GestureDetector(
                    onTap: (){
                      Navigator.pushNamed(context, '/register');
                    },
                    child: Text(
                      'Register instead',
                      style: TextStyle(
                        color: Colors.blue,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ],
              )
            ],
          )
        )
      ),
    );
  }
}
