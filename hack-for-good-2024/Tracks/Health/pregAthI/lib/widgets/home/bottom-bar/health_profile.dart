import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_icons_fix/flutter_icons_fix.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:pregathi/bottom-sheet/insta_share_bottom_sheet.dart';
import 'package:pregathi/const/constants.dart';
import 'package:pregathi/multi-language/classes/language_constants.dart';
import 'package:pregathi/navigators.dart';
import 'package:sizer/sizer.dart';

class HealthProfileScreen extends StatefulWidget {
  const HealthProfileScreen({Key? key}) : super(key: key);

  @override
  _HealthProfileScreenState createState() => _HealthProfileScreenState();
}

class _HealthProfileScreenState extends State<HealthProfileScreen> {
  bool isSaving = false;
  final TextEditingController _ageController = TextEditingController();
  final TextEditingController _gestationalAgeController =
      TextEditingController();
  final TextEditingController _bmiController = TextEditingController();
  final TextEditingController _sympatheticCamController =
      TextEditingController();
  final TextEditingController _parasympatheticCamController =
      TextEditingController();
  final User? user = FirebaseAuth.instance.currentUser;

  @override
  void initState() {
    super.initState();
    loadData();
  }

  Future<void> loadData() async {
    final User? user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      DocumentSnapshot userData = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .get();

      setState(() {
        _ageController.text = userData['age'];
        _gestationalAgeController.text = userData['gestationalAge'];
        _bmiController.text = userData['bmi'];
        _sympatheticCamController.text = userData['sympatheticCam'];
        _parasympatheticCamController.text = userData['parasympatheticCam'];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    double cardHeightWidth = 90;
    double iconSize = 40;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
            icon: Icon(
              Icons.arrow_back_ios_new_rounded,
              color: Colors.white,
            ),
            onPressed: () => goBack(context)),
        title: Text(
          'Health Profile',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        centerTitle: false,
        backgroundColor: primaryColor,
        actions: [
          TextButton(
            onPressed: () {
              _updateHealthProfile();
            },
            child: Text(
              translation(context).save,
              style: TextStyle(
                color: Colors.white,
                fontSize: 15.sp,
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 10.0, right: 10.0),
        child: FloatingActionButton(
          onPressed: () {
            showModalBottomSheet<void>(
              context: context,
              builder: (BuildContext context) {
                return InstaShareBottomSheet();
              },
            );
          },
          backgroundColor: Colors.red,
          foregroundColor: boxColor,
          highlightElevation: 50,
          child: Icon(
            Icons.warning_outlined,
          ),
        ),
      ),
      body: isSaving
          ? progressIndicator(context)
          : SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.all(20.sp),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        GestureDetector(
                          onTap: () {},
                          child: SizedBox(
                            height: cardHeightWidth,
                            width: cardHeightWidth,
                            child: Card(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              color: primaryColor,
                              elevation: 16,
                              child: Center(
                                child: FaIcon(
                                  FontAwesomeIcons.plus,
                                  size: iconSize,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: () {},
                          child: SizedBox(
                            height: cardHeightWidth,
                            width: cardHeightWidth,
                            child: Card(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              color: primaryColor,
                              elevation: 16,
                              child: Center(
                                child: Icon(
                                  FontAwesomeIcons.ribbon,
                                  size: iconSize,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: () => {},
                          child: SizedBox(
                            height: cardHeightWidth,
                            width: cardHeightWidth,
                            child: Card(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              color: primaryColor,
                              elevation: 16,
                              child: Center(
                                child: Icon(
                                  FlutterIcons.baby_carriage_mco,
                                  size: iconSize,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(
                      height: 40,
                    ),
                    Center(
                      child: Text(
                        'Medical Info',
                        style: TextStyle(
                          fontSize: 25.sp,
                        ),
                      ),
                    ),
                    TextFormField(
                      controller: _ageController,
                      decoration: InputDecoration(labelText: 'Age'),
                      keyboardType: TextInputType.number,
                    ),
                    TextFormField(
                      controller: _gestationalAgeController,
                      decoration: InputDecoration(labelText: 'Gestational Age'),
                      keyboardType: TextInputType.number,
                    ),
                    TextFormField(
                      controller: _bmiController,
                      decoration: InputDecoration(labelText: 'BMI'),
                      keyboardType: TextInputType.number,
                    ),
                    TextFormField(
                      controller: _sympatheticCamController,
                      decoration: InputDecoration(
                          labelText: 'Sympathetic CAM (LF Form)'),
                    ),
                    TextFormField(
                      controller: _parasympatheticCamController,
                      decoration: InputDecoration(
                          labelText: 'Parasympathetic CAM (HF Form)'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Future<void> _updateHealthProfile() async {
    try {
      final User? user = FirebaseAuth.instance.currentUser;

      setState(() {
        isSaving = true;
      });

      await FirebaseFirestore.instance
          .collection('users')
          .doc(user!.uid)
          .update({
        'age': _ageController.text,
        'gestationalAge': _gestationalAgeController.text,
        'bmi': _bmiController.text,
        'sympatheticCam': _sympatheticCamController.text,
        'parasympatheticCam': _parasympatheticCamController.text,
      });

      dialogueBoxWithButton(context, 'Health Profile Updated Successfully');

      setState(() {
        isSaving = false;
      });
    } catch (e) {
      Fluttertoast.showToast(msg: 'Failed to update health profile');
    }
  }
}
