// // "use client"
// // import { FilePlus2 } from 'lucide-react'
// // import React, { useRef, useState } from 'react'

// // type Props = {}

// // const InputPdf = (props: Props) => {
// //     const pdfInputRef: any = useRef(null);  
// //     const [extractedText, setExtractedText] = useState<string>('');

// //     const openBrowse = () => {
// //         pdfInputRef.current?.click();
// //     }

// //     const sendPDFFileToAPI = (file: File) => {
// //         const formData = new FormData();
// //         formData.append('file', file);

// //         return fetch('https://pdf-text-extractor-api.onrender.com/extractText', {
// //             method: 'POST',
// //             body: formData
// //         })
// //         .then(response => {
// //             if (!response.ok) {
// //                 throw new Error('Network response was not ok');
// //             }
// //             return response.json();
// //         })
// //         .then(data => {
// //             if (data.text) {
// //                 setExtractedText(data.text);
// //             } else {
// //                 throw new Error('Text not found in response');
// //             }
// //         })
// //         .catch(error => {
// //             setExtractedText('Error: ' + error.message);
// //         });
// //     };

// //     return (
// //         <>
// //             <input 
// //                 type="file" 
// //                 ref={pdfInputRef}
// //                 hidden
// //                 id='pdfInput' 
// //                 required 
// //                 onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
// //                     if(e.target.files){
// //                         const selectedFile: File = e.target.files[0]!;
// //                         sendPDFFileToAPI(selectedFile);
// //                     }    
// //                 }}/>  
// //             <div className="bg-secondary p-6 rounded-lg shadow-md shadow-black gap-4 flex flex-col">
// //                 <h1 className="font-semibold">Pdf to Text Extraction</h1>
// //                 <p>Extract test/assessment questions from your Pdf document to curate a personalized mock test using AI.</p>
                
// //                 <div onClick={openBrowse} className="flex flex-col dark:bg-slate-500 bg-slate-300 rounded-lg justify-center cursor-pointer items-center text-center border p-4 gap-2">
// //                     <p>Browse Or Drop Your Pdf Here</p>
// //                     <FilePlus2 className="w-6 h-6"/>
// //                 </div>
// //             </div>
// //             <textarea
// //                 value={extractedText}
// //                 className="mt-4 p-2 w-full h-40 resize-none border rounded-lg"
// //                 readOnly
// //                 placeholder="Extracted Text from PDF"
// //             />
// //         </>
// //     )
// // }

// // export default InputPdf;


// "use client"
// import { FilePlus2 } from 'lucide-react'
// import React, { useRef, useState } from 'react'
// import TextCards from './TextCards'

// type Props = {}

// const InputPdf = (props: Props) => {
//     const pdfInputRef: any = useRef(null);  
//     const [processing, setProcessing] = useState<boolean>(false);
//     const [extractedText, setExtractedText] = useState<Array<string>>([]);

//     const openBrowse = () => {
//         pdfInputRef.current?.click();
//     }

//     const sendPDFFileToAPI = async (file: File) => {
//         const formData = new FormData();
//         formData.append('file', file);

//         setProcessing(true);

//         try {
//             const response = await fetch('https://pdf-text-extractor-api.onrender.com/extractText', {
//                 method: 'POST',
//                 body: formData
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const data = await response.json();
//             if (data.text) {
//                 setExtractedText([...extractedText, data.text]);
//             } else {
//                 throw new Error('Text not found in response');
//             }
//         } catch (error) {
//             setExtractedText([...extractedText, 'Error: ' + (error as Error).message]);
//         } finally {
//             setProcessing(false);
//         }
//     };

//     return (
//         <>
//             <input 
//                 type="file" 
//                 ref={pdfInputRef}
//                 hidden
//                 id='pdfInput' 
//                 required 
//                 onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
//                     if(e.target.files){
//                         const selectedFile: File = e.target.files[0]!;
//                         sendPDFFileToAPI(selectedFile);
//                     }    
//                 }}/>  
//             <div className="bg-secondary p-6 rounded-lg shadow-md shadow-black gap-4 flex flex-col">
//                 <h1 className="font-semibold">Pdf to Text Extraction</h1>
//                 <p>Extract test/assessment questions from your Pdf document to curate a personalized mock test using AI.</p>
                
//                 <div onClick={openBrowse} className="flex flex-col dark:bg-slate-500 bg-slate-300 rounded-lg justify-center cursor-pointer items-center text-center border p-4 gap-2">
//                     <p>Browse Or Drop Your Pdf Here</p>
//                     <FilePlus2 className="w-6 h-6"/>
//                 </div>
//             </div>
//             <div className="bg-secondary p-6 rounded-lg shadow-md shadow-black flex flex-col gap-4">
//                 <h1 className="font-semibold">Extracted Text from PDF</h1>
//                 {processing ? 
//                     <div className='flex flex-col justify-center items-center gap-2'>
//                         <p>Processing</p>
//                         <div className="animate-spin w-6 h-6" />
//                     </div> : 
//                     <div>
//                         {extractedText.map((text, index) => (
//                             <textarea
//                                 key={index}
//                                 value={text}
//                                 className="mt-4 p-2 w-full h-40 resize-none border rounded-lg"
//                                 readOnly
//                             />
//                         ))}
//                     </div>
//                 }
//             </div>
//         </>
//     )
// }

// export default InputPdf;

"use client"
import { FilePlus2 } from 'lucide-react'
import React, { useRef, useState } from 'react'
import TextCards from './TextCards'

type Props = {}

const InputPdf = (props: Props) => {
    const pdfInputRef: any = useRef(null);  
    const [processing, setProcessing] = useState<boolean>(false);
    const [extractedText, setExtractedText] = useState<Array<string>>([]);

    const openBrowse = () => {
        pdfInputRef.current?.click();
    }

    const sendPDFFileToAPI = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        setProcessing(true);

        try {
            const response = await fetch('https://pdf-text-extractor-api.onrender.com/extractText', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.text) {
                setExtractedText([...extractedText, data.text]);
            } else {
                throw new Error('Text not found in response');
            }
        } catch (error) {
            setExtractedText([...extractedText, 'Error: ' + (error as Error).message]);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <input 
                type="file" 
                ref={pdfInputRef}
                hidden
                id='pdfInput' 
                required 
                onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                    if(e.target.files){
                        const selectedFile: File = e.target.files[0]!;
                        sendPDFFileToAPI(selectedFile);
                    }    
                }}/>  
            <div className="bg-secondary p-6 rounded-lg shadow-md shadow-black gap-4 flex flex-col">
                <h1 className="font-semibold">Pdf to Text Extraction</h1>
                <p>Extract test/assessment questions from your Pdf document to curate a personalized mock test using AI.</p>
                
                <div onClick={openBrowse} className="flex flex-col dark:bg-slate-500 bg-slate-300 rounded-lg justify-center cursor-pointer items-center text-center border p-4 gap-2">
                    <p>Browse Or Drop Your Pdf Here</p>
                    <FilePlus2 className="w-6 h-6"/>
                </div>
                <div>
                        {extractedText.map((text, index) => (
                            <TextCards key={index} index={index} txt={text} />
                        ))}
                    </div>
            </div>
            {/* <div className="bg-secondary p-6 rounded-lg shadow-md shadow-black flex flex-col gap-4">
                <h1 className="font-semibold">Extracted Text from PDF</h1>
                {processing ? 
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <p>Processing</p>
                        <div className="animate-spin w-6 h-6" />
                    </div> : 
                    // <div>
                    //     {extractedText.map((text, index) => (
                    //         <TextCards key={index} index={index} txt={text} />
                    //     ))}
                    // </div>
                }
            </div> */}
        </>
    )
}

export default InputPdf;