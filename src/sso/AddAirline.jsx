import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminMenu from "../components/AdminMenu";
import AdminNav from "../components/AdminNav";
import app from "../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function AddAirline() {

  const [flightName, setFlightName] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [flights, setFlights] = useState([]);
  const [existingNames, setExistingNames] = useState('');
  const [image, setImage] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage_, setErrorMessage_] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAirlineNames = async () => {
        const response = await fetch("https://airline-management-and-booking-syst.vercel.app/api/airlines");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const names = await response.json();
        // console.log(names);
        setExistingNames(names);
    };
    fetchAirlineNames();
  }, []);

  const handleChangeName = (event) => {
    setFlightName(event.target.value);
  };

  const handleChangeNo = event => {
    setFlightNumber(event.target.value);
  };

  const handleImage = (e) => {
    const file = e.target.files[0]
    // console.log(file);
    setImage(file);

    // Create a Blob URL for the selected image file
    const imageURL = URL.createObjectURL(file);
    setImagePreview(imageURL);
    // console.log(imageURL);
  }

  const uploadImage = (file, flightNumber) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const storageRef = ref(storage, 'airlines/' + flightNumber + '.' + file.name.split('.')[1]);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          // console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              // console.log('Upload is paused');
              break;
            case 'running':
              // console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // Handle errors
          switch (error.code) {
            case 'storage/unauthorized':
              reject(new Error('User doesn\'t have permission to access the object'));
              break;
            case 'storage/canceled':
              reject(new Error('User canceled the upload'));
              break;
            case 'storage/unknown':
              reject(new Error('Unknown error occurred'));
              break;
          }
        }, 
        () => {
          // Upload completed successfully, get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL);
            resolve(downloadURL);  // Resolve the promise with the downloadURL
          }).catch(reject);  // Reject the promise if there is an error getting the URL
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true);
    // Wait for the image to be uploaded and get the image URL
    const imageURL = await uploadImage(image, flightNumber);

    const flightData = {
      flightName,
      flightCode: flightNumber,
      flights,
      image: imageURL
    };
          const response = await fetch("https://airline-management-and-booking-syst.vercel.app/api/airlines", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(flightData),
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        alert("Flight added successfully!");
        navigate("/admin/airlinemanagement");
        // console.log(flightData);
  };

  useEffect(() => {
    if (Array.isArray(existingNames)) {
      const existingName = existingNames.find(existingName => existingName.flightName === flightName);
      if (existingName) {
        setErrorMessage('Flight Name already exists!');
      } else {
        setErrorMessage('');
      }
    }
  }, [flightName, existingNames]);

  useEffect(() => {
    if (Array.isArray(existingNames)) {
      const existingName = existingNames.find(existingName => existingName.flightCode === flightNumber);
      if (existingName)
      setErrorMessage_('Flight Code already exists!');
      else if(flightNumber.length < 2 && flightNumber.length > 0)
      setErrorMessage_('Flight Code must of length 2');
      else 
      setErrorMessage_('');
    }
  }, [flightNumber, existingNames]);

  const handleReset = () => {
    setFlightName('');
    setFlightNumber('');
  }

  return (
    <div className="grid grid-cols-12 min-h-screen min-w-screen">
{/*       <div className="min-h-screen col-span-3 flex flex-col items-center">
        <AdminMenu/>
      </div> */}
      {/* Toggle Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-slate-700 text-white px-4 py-2 rounded shadow-lg"
      >
        {/* {isOpen ? 'Close' : 'Menu'} */}
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
      </button>
      {/* Sliding Menu - Overlays screen, doesn't shift layout */}
      <div
        className={`fixed top-0 left-0 h-full shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminMenu />
      </div>
      {/* Backdrop when menu is open (optional UX) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className=" min-h-screen col-span-full p-10 z-10 relative">
        <AdminNav/>
        <div className=" min-h-[220px] p-4 mt-20 rounded-lg shadow-lg">
          <div className="flex justify-between mb-4">
            <h1 className="text-3xl text-gray-500 font-semibold">
              Add New Airline
            </h1>
            <Link to="/admin/airlinemanagement">
              <button
                type="button"
                class="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
              >
                <i className="fa-solid fa-plane pr-2 rotate-[-45deg] mb-1"></i>
                VIEW AIRLINE(s)
              </button></Link>
          </div>
          <form className="mt-12 relative" onSubmit={handleSubmit}>
            <div className="p-4">
              <div className="p-4 flex items-center h-20">
                <label for="flightNo" className="text-xl font-medium">
                  Enter Airline Name
                </label>
                {/* <div className="ml-[235px] text-xl">:</div> */}
                  <input type="text" name="flightName" required id="flightName" value={flightName} onChange={handleChangeName} placeholder="Airline Name" className="border border-slate-500 w-96 absolute left-1/2 h-8 pl-2 rounded-md" disabled={isSubmitted}></input>
                  {errorMessage ? (<div className="absolute left-1/2 text-red-500 text-sm font-bold flex justify-center items-center gap-1 mt-14"><img src="https://cdn-icons-png.flaticon.com/512/16208/16208197.png" alt="" className="h-5 w-5" /> {errorMessage}</div>) : (flightName && <div className="absolute left-1/2 text-green-700 text-sm font-bold flex justify-center items-center gap-1 mt-14"><img src="https://cdn-icons-png.flaticon.com/512/4315/4315445.png " className="h-5 w-5"></img> Flight Name is valid !</div>)}
              </div>
              <div className="p-4 flex items-center bg-slate-100 h-20">
                <label for="flightNo" className="text-xl font-medium">
                  Enter Airline Code
                </label>
                <input type="text" name="flightNumber" required id="flightNumber" value={flightNumber} onChange={handleChangeNo} placeholder="Airline Code" className="border border-slate-500 w-96 absolute left-1/2 h-8 pl-2 rounded-md" maxLength={2} disabled={isSubmitted}></input>
                {errorMessage_ ? (<div className="absolute left-1/2 text-red-500 text-sm font-bold flex justify-center items-center gap-1 mt-14"><img src="https://cdn-icons-png.flaticon.com/512/16208/16208197.png" alt="" className="h-5 w-5" /> {errorMessage_}</div>) : (flightNumber && <div className="absolute left-1/2 text-green-700 text-sm font-bold flex justify-center items-center gap-1 mt-14"><img src="https://cdn-icons-png.flaticon.com/512/4315/4315445.png " className="h-5 w-5"></img> Flight Code is valid !</div>)}
              </div>
              {/* <div className="p-4 flex items-center">
                <label for="flightNo" className="text-xl font-medium">
                  Upload Airline Image
                </label>
                <input type="file" name="flightImage" required id="flightImage" accept="image/*" onChange={handleImage} className="w-96 absolute left-1/2 h-8 pl-2 rounded-md"></input>
              </div> */}
              <div className="p-4 flex items-center">
                <label htmlFor="flightImage" className="text-xl font-medium">Upload Airline Logo</label>
                <input type="file" name="flightImage" required id="flightImage" accept="image/*" onChange={handleImage} className="border border-slate-500 w-96 absolute left-1/2 h-8 pl-2 rounded-md" disabled={isSubmitted}/>
                {/* Image Preview */}
                {imagePreview && (
                  <div className="p-4 flex items-center flex-col">
                    <img
                      src={imagePreview}
                      alt="Airline Preview"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-20 justify-center mt-10 pt-10">
                <button type="submit" className="bg-[#585eff] w-20 h-10 rounded-md text-white font-semibold disabled:opacity-50" disabled={errorMessage || errorMessage_ || flightName == '' || flightNumber == ''}>
                  Submit
                </button>
                <button type="reset" onClick={handleReset} className="bg-[#ee3333] w-20 h-10 rounded-md text-white font-semibold">
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAirline;
