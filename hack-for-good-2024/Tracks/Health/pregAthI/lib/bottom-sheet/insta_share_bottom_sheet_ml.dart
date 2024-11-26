// import 'package:flutter/material.dart';
// import 'package:firebase_ml_custom/firebase_ml_custom.dart';
// import 'package:firebase_database/firebase_database.dart';
// import 'package:firebase_database/ui/firebase_animated_list.dart';
// import 'package:fluttertoast/fluttertoast.dart';
// import 'package:geocoding/geocoding.dart';
// import 'package:geolocator/geolocator.dart';
// import 'package:intl/intl.dart';
// import 'package:permission_handler/permission_handler.dart';
// import 'package:pregathi/buttons/main_button.dart';
// import 'package:pregathi/const/constants.dart';
// import 'package:pregathi/db/db_services.dart';
// import 'package:pregathi/model/contacts.dart';
// import 'package:pregathi/model/emergency_message.dart';
// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:background_sms/background_sms.dart';
// import 'package:pregathi/widgets/home/insta_share/wife_emergency_alert.dart';
// import 'package:tflite_flutter/tflite_flutter.dart';
// import 'package:tflite_flutter_helper/tflite_flutter_helper.dart';

// class InstaShareBottomSheet extends StatefulWidget {
//   const InstaShareBottomSheet({Key? key}) : super(key: key);

//   @override
//   State<InstaShareBottomSheet> createState() => _InstaShareBottomSheetState();
// }

// class _InstaShareBottomSheetState extends State<InstaShareBottomSheet> {
//   final ref = FirebaseDatabase(
//           databaseURL:
//               "https://pregathi-69-default-rtdb.asia-southeast1.firebasedatabase.app")
//       .ref('sensors');
//   late String bpm;
//   late String sValue;
//   bool isEmergency = false;
//   final User? user = FirebaseAuth.instance.currentUser;
//   Position? _currentPosition;
//   String? _currentAddress;
//   String? _currentLat;
//   String? _currentLong;
//   String? _currentLocality;
//   String? _currentPostal;
//   LocationPermission? permission;
//   late String husbandPhoneNumber;
//   late String hospitalPhoneNumber;
//   late Interpreter _interpreter;
//   late TensorImage _inputImage;
//   late TensorBuffer _outputBuffer;
//   final TextEditingController _ageController = TextEditingController();
//   final TextEditingController _gestationalAgeController = TextEditingController();
//   final TextEditingController _bmiController = TextEditingController();
//   final TextEditingController _sympatheticCamController = TextEditingController();
//   final TextEditingController _parasympatheticCamController = TextEditingController();

//   @override
//   void initState() {
//     super.initState();
//     _initInterpreter();
//     _getPermission();
//     _getCurrentLocation();
//     loadData();
//     setWifeLocation();
//   }

//   Future<void> _initInterpreter() async {
//     FirebaseCustomModel firebaseCustomModel = FirebaseCustomModel('Emergency-Detector');
//     FirebaseModelManager firebaseModelManager = FirebaseModelManager.instance;
//     await firebaseModelManager.registerRemoteModel(firebaseCustomModel);

//     InterpreterOptions options = InterpreterOptions()
//       ..addDelegate(GpuDelegate())
//       ..threadCount = 2;

//     _interpreter = await Interpreter.fromFirebaseModel(
//       interpreterOptions: options,
//       remoteModelName: 'Emergency-Detector',
//     );

//     _inputImage = TensorImage(TfLiteType.uint8);
//     _outputBuffer = TensorBuffer.createFixedSize(<int>[1, 1], TfLiteType.float32);
//   }

//   @override
//   void dispose() {
//     _interpreter.close();
//     super.dispose();
//   }

//   Future<void> loadData() async {
//     final User? user = FirebaseAuth.instance.currentUser;
//     if (user != null) {
//       DocumentSnapshot userData = await FirebaseFirestore.instance
//           .collection('users')
//           .doc(user.uid)
//           .get();

//       setState(() {
//         _ageController.text = userData['age'];
//         _gestationalAgeController.text = userData['gestationalAge'];
//         _bmiController.text = userData['bmi'];
//         _sympatheticCamController.text = userData['sympatheticCAM'];
//         _parasympatheticCamController.text = userData['parasympatheticCAM'];
//       });
//     }
//   }

//   Future<void> _makePrediction() async {
//     double age = double.tryParse(_ageController.text) ?? 0.0;
//     double gestationalAge = double.tryParse(_gestationalAgeController.text) ?? 0.0;
//     double bmi = double.tryParse(_bmiController.text) ?? 0.0;
//     double sympatheticCam = double.tryParse(_sympatheticCamController.text) ?? 0.0;
//     double parasympatheticCam = double.tryParse(_parasympatheticCamController.text) ?? 0.0;

//     List<double> inputData = [
//       age, // Age
//       gestationalAge, // Gestational Age
//       bmi, // BMI
//       sympatheticCam, // Sympathetic CAM (LF Norm)
//       parasympatheticCam, // Parasympathetic CAM (HF Norm)
//       double.tryParse(bpm) ?? 0.0, // Heart Rate (parsed from bpm)
//     ];

//     _inputImage.loadList(inputData);

//     _interpreter.run(_inputImage.buffer, _outputBuffer.buffer);

//     double prediction = _outputBuffer.getDoubleValue(0, 0);
//     if (prediction >= 0.5) {
//       setState(() {
//         isEmergency = true;
//       });
//       sendAlert();
//     } else {
//       setState(() {
//         isEmergency = false;
//       });
//     }
//   }

//   // Other methods and UI widgets from your original code...

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       height: MediaQuery.of(context).size.height / 1.4,
//       decoration: const BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.only(
//           topLeft: Radius.circular(30),
//           topRight: Radius.circular(30),
//         ),
//       ),
//       child: Padding(
//         padding: const EdgeInsets.all(15.0),
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             const Text(
//               "Send current location immediately to your emergency contacts and nearby volunteers..",
//               textAlign: TextAlign.center,
//               style: TextStyle(fontSize: 24),
//             ),
//             const SizedBox(
//               height: 10,
//             ),
//             const Text(
//               "Live Data:",
//               textAlign: TextAlign.center,
//               style: TextStyle(fontSize: 20),
//             ),
//             Container(
//               height: MediaQuery.of(context).size.height / 13.5,
//               child: FirebaseAnimatedList(
//                 query: ref,
//                 itemBuilder: (context, snapshot, animation, index) {
//                   bpm = snapshot.child('BPM').value.toString();
//                   sValue = snapshot.child('Svalue').value.toString();
//                   if (int.tryParse(bpm)! > 90) {
//                     _makePrediction();
//                     sendAlert();
//                   }
//                   return Column(
//                     children: [
//                       Text(
//                         'BPM: $bpm',
//                         textAlign: TextAlign.center,
//                         style: TextStyle(fontSize: 18),
//                       ),
//                       Text(
//                         'S-Value: $sValue',
//                         textAlign: TextAlign.center,
//                         style: TextStyle(fontSize: 18),
//                       ),
//                     ],
//                   );
//                 },
//               ),
//             ),
//             _currentAddress != null
//                 ? Text(
//                     'Address: $_currentAddress',
//                     textAlign: TextAlign.center,
//                     style: TextStyle(fontSize: 18),
//                   )
//                 : smallProgressIndicator(context),
//             Padding(
//               padding: const EdgeInsets.only(top: 20.0),
//               child: MainButton(
//                 title: "Send Alert",
//                 onPressed: () async {
//                   await sendAlert();
//                   Navigator.push(
//                       context,
//                       MaterialPageRoute(
//                           builder: (context) => WifeEmergencyScreen()));
//                 },
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:pregathi/bottom-sheet/insta_share_bottom_sheet.dart';
import 'package:pregathi/const/constants.dart';
import 'package:pregathi/navigators.dart';
import 'package:sizer/sizer.dart';

class HealthProfileScreen extends StatefulWidget {
  const HealthProfileScreen({Key? key}) : super(key: key);

  @override
  _HealthProfileScreenState createState() => _HealthProfileScreenState();
}

class _HealthProfileScreenState extends State<HealthProfileScreen> {
  final ref = FirebaseDatabase(
          databaseURL:
              "https://pregathi-69-default-rtdb.asia-southeast1.firebasedatabase.app")
      .ref('sensors');
  late String bpm;
  late String sValue;
  final TextEditingController _ageController = TextEditingController();
  final TextEditingController _gestationalAgeController =
      TextEditingController();
  final TextEditingController _bmiController = TextEditingController();
  final TextEditingController _sympatheticCamController =
      TextEditingController();
  final TextEditingController _parasympatheticCamController =
      TextEditingController();
  bool isSaving = false;
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
              'Save',
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
                    TextFormField(
                      controller: _ageController,
                      decoration: InputDecoration(labelText: 'Age'),
                      keyboardType: TextInputType.number,
                    ),
                    TextFormField(
                      controller: _gestationalAgeController,
                      decoration: InputDecoration(labelText: 'Gestational Age (In weeks)'),
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
                      keyboardType: TextInputType.number,
                    ),
                    TextFormField(
                      controller: _parasympatheticCamController,
                      decoration: InputDecoration(
                          labelText: 'Parasympathetic CAM (HF Form)'),
                      keyboardType: TextInputType.number,
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

      dialogueBoxWithButton(context, 'Health Profile updated successfully');

      setState(() {
        isSaving = false;
      });
    } catch (e) {
      Fluttertoast.showToast(msg: 'Failed to update health profile');
    }
  }
}

