import 'package:flutter/material.dart';
import '../components/auth_textfields.dart';
import '../components/auth_button.dart';

class RegisterPage extends StatelessWidget {
  RegisterPage({super.key});

  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final passwordAgainController = TextEditingController();

  // filling this method out when register api is complete
  // added temporary redirect to the userhomepage
  void signUpUser(BuildContext context){
    Navigator.pushNamed(context, '/userHomePage');
  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(height: 40),
                Icon(
                  Icons.account_circle,
                  size: 100,
                  color: Colors.blue,
                ),

                SizedBox(height: 50),

                Text(
                  "Welcome to the Event Organizer App",
                  style: TextStyle(
                    color: Colors.grey[700],
                    fontSize: 18,
                  ),
                ),

                SizedBox(height: 35),
            
                AuthTextFields(
                  controller: nameController,
                  hintText: 'Full Name',
                  obscureText: false,
                  icon: Icons.person,
                ),

                SizedBox(height: 10),
                AuthTextFields(
                  controller: emailController,
                  hintText: 'Email',
                  obscureText: false,
                  icon: Icons.email,
                ),

                SizedBox(height: 10),
                // password textfield
                AuthTextFields(
                  controller: passwordController,
                  hintText: 'Password',
                  obscureText: true,
                  icon: Icons.lock,
                ),

                SizedBox(height: 10),
                // password textfield
                AuthTextFields(
                  controller: passwordAgainController,
                  hintText: 'Confirm Password',
                  obscureText: true,
                  icon: Icons.lock,
                ),
            
                SizedBox(height: 60),
                AuthButton(
                  onTap: () => signUpUser(context),
                  label: 'Sign Up',
                ),

                SizedBox(height: 25),

                Divider(),

                SizedBox(height: 50),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Already have an account?',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 16,
                      ),
                    ),

                    const SizedBox(width: 4),

                    GestureDetector(
                      onTap: (){
                        Navigator.pushNamed(context, '/login');
                      },
                      child: Text(
                        'Sign In instead',
                        style: TextStyle(
                          color: Colors.blue,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ],
                )
            ]),
          ),
        ),
      ),
    );
  }
}
