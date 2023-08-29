const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');
const path = require('path');
const fs = require('fs');
const officegen = require('officegen');
const nodemailer = require('nodemailer')
const ExchangeRates = require('../models/ExchangeRates')
const WarehouseInventory = require('../models/WarehouseInventory')
const Driver = require('../models/Drivers')

const mailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'rshadrackochieng@gmail.com',
    pass: 'dufhbqmcdepbhvdk',
  },
});


let newService = asyncHandler( async(req,res) =>{
    try{
        const service = await Service.create(req.body)
        if (service) {
            res.status(201).json({ message: 'Created successfully' });
          } else {
            res.status(401);
            throw new Error('Unable to create');
          }

    }catch (error) {
      console.error('Error creating a Demp:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
})


let allService = asyncHandler(async(req,res) =>{
  try{
    const services = await Service.find().sort({ createdAt: -1 })
    res.status(200).json(services)

}catch(error){
    res.status(404).json({message: error.message})
}
})




const singleService = asyncHandler(async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404);
      throw new Error('Order not Found');
    }
    res.status(200).json(service)
    
  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});

const updateService = asyncHandler(async(req, res) =>{
   //await Service.deleteMany({});
  //  console.log(req.body)
  try {
  const service = await Service.findById(req.body.serviceId);

  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  if (service) {
    const {
      currencies,
      amounts,
      order,
      ...otherFields 
    } = req.body;

    service.set(otherFields); 

    if (order && order.length > 0) {
      service.order = order;
    }

    if (currencies && amounts && currencies.length === amounts.length) {
      const currencyAmountPairs = currencies.map((currency, index) => ({
        currency,
        amount: amounts[index],
      }));
      service.currencyAmounts = currencyAmountPairs;
    }

    if (req.body.reports && req.body.reports.length > 0) {
      const validReports = req.body.reports.filter(report => report !== null);
      service.reports.push(...validReports);
    }

    await service.save();
    res.status(200).json({ message: 'Quote Successfully Updated' });
  } else {
    return res.status(404).json({ message: 'Service not found' });
  }
} catch (error) {
  console.error('Error updating service:', error);
  res.status(500).json({ message: 'An error occurred while updating the service' });
}

  
})

// const sendQuote = asyncHandler(async (req, res) => {
//   try {
//     let service = await Service.findById(req.body.id);
//     if (service) {
//       const docx = officegen('docx');
//       const imagePath = path.join(__dirname, '../uploads', 'globeflight.png');

//       // Add a title
//       const title = docx.createP();
//       title.addText('Order Confirmation and Approval Request', { bold: true, font_face: 'Arial', font_size: 18 });

//       // Add image
//       const imageParagraph = docx.createP();
//       const imageOptions = {
//         cx: 300,
//         cy: 200,
//         floating: {
//           horizontalPosition: { relative: 'margin', align: 'center' },
//           verticalPosition: { relative: 'page', align: 'top', offset: 0 },
//           margin: { top: 0 },
//         },
//       };
//       imageParagraph.addImage(imagePath, imageOptions);

//       // Add other content
//       const content = `
// Subject: Validate and Authorize Your Order
// Dear ${service.contactPerson},
// Hello! I'm delighted to inform you that your order has been meticulously handled as per our recent conversation. All your specific requirements have been meticulously integrated into the final product, ensuring a precise fit. Your order consists of:
// Service: ${service.order}  Origin: ${service.origin} Destination: ${service.destination} Weight: ${service.measure} ${service.weight}
// Description: ${service.description}
// Dimension: ${service.dimension}
// Number of Packages: ${service.packages} Amount: ${service.currency} ${service.amount}
// Kindly peruse the above at your earliest. Approving by signing and sending it back will kickstart the process. If it's all in line with your wishes, please grant us the green light to proceed.
// Please provide your signature and approval below:
// Signature: ________________________
// Date: ____________________________
// Once we receive your approval, we will swiftly move forward to ensure a prompt delivery and impeccable service. Should you have any questions or require further clarification, please do not hesitate to contact us.
// Thank you for choosing us for your needs. We look forward to your prompt response.
// Best regards,
// ${service.createdBy.fname} ${service.createdBy.lname}
// ${service.createdBy.jobtitle}
// ${service.createdBy.mobile}
// `;

//       const contentLines = content.split('\n');
//       contentLines.forEach(line => {
//         const paragraph = docx.createP();
//         const trimmedLine = line.trim();

//         if (trimmedLine.startsWith('Subject:')) {
//           paragraph.addText(trimmedLine, { bold: true, font_face: 'Arial', font_size: 16 });
//         } else if (trimmedLine.startsWith('Dear')) {
//           paragraph.addText(trimmedLine, { font_face: 'Arial', font_size: 14 });
//         } else {
//           paragraph.addText(trimmedLine, { font_face: 'Arial', font_size: 10 });
//         }
//       });

//       const outputPath = path.join(__dirname, '../uploads', `${service._id} confirmation.docx`);
//       const outputStream = fs.createWriteStream(outputPath);

//       docx.generate(outputStream);

//       outputStream.on('close', () => {
//         sendEmailWithAttachment(service, outputPath) 
//             .then(async() => {
//               service.status = 'Pending'
//               service.document = `Quotation:${service._id} confirmation.docx`
//               service  = await service.save()
//                 res.send({message:'Quote Sent  to Client'});
//             })
//             .catch(err => {
//                 console.error('Error sending email:', err);
//                 res.status(500).send({message:'Error sending email'});
//             });
//     });

//     docx.on('error', err => {
//         console.error('Error generating Word document:', err);
//         res.status(500).send('Error generating Word document');
//     });
//     } else {
//       res.status(404);
//       throw new Error('Quote not Found');
//     }
//   } catch (err) {
//     console.error('Error:', err);
//     res.status(500).send('An error occurred');
//   }
// });

// const sendEmailWithAttachment = async(service,filepath) =>{
//   const attachment = {
//       filename: 'order_confirmation.docx',
//       path: filepath,
//       contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     };
//   const mailTransporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: 'rshadrackochieng@gmail.com',
//         pass: 'dufhbqmcdepbhvdk',
//       },
//     });

//     const mailDetails = {
//       from: 'rshadrackochieng@gmail.com',
//       to: service.email,
//       subject: 'Order Confirmation and Approval Request',
//       text: 'Order confirmation details',
//       html: '<p>Order confirmation details</p>',
//       attachments: [attachment],
//     };
//     try {
//       await mailTransporter.sendMail(mailDetails);
//       console.log('Email sent');
//     } catch (err) {
//       console.error('Email error:', err);
//     }
// }

const updateDocument = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const documentName = req.body.documentName;
  const uploadedFileName = req.files[0].filename; // Get the actual file name that was saved

  if (req.fileFilterError) {
    const errorMessage = req.fileFilterError.message;
    const statusCode = req.fileFilterError.status || 500;
    return res.status(statusCode).json({ error: errorMessage });
  } else {
    let service = await Service.findById(id);

    if (documentName === 'Quotation') {
      // Handle the case of the quotation document
      const existingQuotationIndex = service.document.findIndex(doc => doc.startsWith(id));
      if (existingQuotationIndex !== -1) {
        // Replace the existing quotation document
        service.document.splice(existingQuotationIndex, 1, `Quotation:${uploadedFileName}`);
      } else {
        // Add the quotation document
        service.document.push(`Quotation:${uploadedFileName}`);
      }
      service.status = 'Approved';
      service.progress = 'Initial';
      service = await service.save();
      res.status(200).json({ message: "Quote Confirmed!" });
    } else if(documentName === 'Airway Bill' || documentName === 'Airway Bill' ){
      const documentWithFileName = `${documentName}:${uploadedFileName}`;
      service.document.push(documentWithFileName);
      service.progress = 'On Transit';
      service = await service.save();
    }else {
      // Handle other types of documents
      const documentWithFileName = `${documentName}:${uploadedFileName}`;
      service.document.push(documentWithFileName);
      service = await service.save();
      res.status(200).json({ message: "Document Saved" });
    }
  }
});



const deleteOrAbortQuote = asyncHandler(async(req,res) =>{
let service = await Service.findById(req.body.id)
if (service){
  if (req.body.command === 'Abort'){
    
    const mailDetails = {
      from: 'rshadrackochieng@gmail.com',
      to: service.email,
      subject: 'Order Cancellation Notification',
      text: "Regretfully, we must inform you that due to unforeseen circumstances, we have decided to cancel your order after careful consideration. We deeply apologize for any inconvenience this may cause. Our team is committed to addressing your concerns. We value your business and hope to have the chance to serve you again. Thank you for your understanding.",
      html: `<p>Regretfully, we must inform you that due to unforeseen circumstances, we have decided to cancel your order after careful consideration. We deeply apologize for any inconvenience this may cause. Our team is committed to addressing your concerns. We value your business and hope to have the chance to serve you again. Thank you for your understanding.</p>`,
  };

  try {
    await mailTransporter.sendMail(mailDetails);

    await Service.deleteOne({_id: req.body.id})
    
    res.status(200).json({ message: "Cancellation Sent to client" });
  } catch (err) {
    console.error('Email error:', err);
  }
  
  }
}else{
  await Service.deleteOne({_id: req.body.id})
    
    res.status(200).json({ message: "Order Deleted" });
}
  
})

const ExchangeRatesFunction = asyncHandler(async(req,res) =>{
  const exchangeRatesData = req.body;
  try{
    let exchangeRateEntry = await ExchangeRates.findOne()

    if(!exchangeRateEntry){
      exchangeRateEntry = new ExchangeRates(exchangeRatesData);
    }else{
      exchangeRateEntry.USD = exchangeRatesData.USD;
      exchangeRateEntry.EUR = exchangeRatesData.EUR;
      exchangeRateEntry.Pound = exchangeRatesData.Pound;

    }
    await exchangeRateEntry.save();
    res.status(200).json({ message: 'Exchange rates updated successfully.' });

  }catch(err){
    res.status(500);
    console.log(err)
    throw new Error('An Error Occured While Updating ExchangeRates');
  }
})
const getExchangeRates = asyncHandler(async(req,res) =>{
  try{
    const Exchange = await ExchangeRates.find()
    res.status(200).json(Exchange)

}catch(error){
    res.status(404).json({message: error.message})
}
})

const ChangeProgress = asyncHandler(async(req,res) =>{
 const service =  await Service.findOne({_id:req.body.id})
 if(service){

  service.progress = req.body.Progress; 

  await service.save();


  await service.save()
  res.status(200).json({message:"Order Progress Changed"})
 }
})


const AddInventory = asyncHandler(async(req,res) =>{
  try{
    const exitDate = new Date(req.body.exitDate)

    await WarehouseInventory.create({
      ...req.body,
      exitDate
    })
    res.status(201).json({message:"Inventory Successfully Created"});

  }catch (error) {
        res.status(500)
        console.log(error.message)
        throw new Error('Unable to Add New Inventory')
      }
})

const getInventories = asyncHandler(async(req,res) =>{
  try{
    const inventories = await WarehouseInventory.find().sort({createdAt: -1})
    res.status(200).json(inventories)

  }
  catch (error) {
    res.status(500)
    console.log(error.message)
    throw new Error('Server Error')
  }
})

const getSingleInventory = asyncHandler(async (req, res) => {
  try {
    const inventory = await WarehouseInventory.findById(req.params.id);
    if (!inventory) {
      res.status(404);
      throw new Error('Order not Found');
    }
    res.status(200).json(inventory)
    
  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});

async function sendAssignmentEmail(driverEmail, clientEmail, driverDetails, goodDetails) {
  const driverEmailOptions = {
    from: 'rshadrackochieng@gmail.com',
    to: driverEmail,
    subject: 'Good Assignment Notification',
    html: `
      <p>Hello ${driverDetails.name},</p>
      <p>You have been assigned to deliver a good.</p>
      <p>Driver Details:</p>
      <p>Name: ${driverDetails.name}</p>
      <p>Contact: ${driverDetails.mobile}</p>
      <p>Good Details:</p>
      <p>${goodDetails}</p>
    `,
  };

  const clientEmailOptions = {
    from: 'rshadrackochieng@gmail.com',
    to: clientEmail,
    subject: 'Good Assignment Notification',
    html: `
      <p>Hello Client,</p>
      <p>Your good has been assigned to a driver.</p>
      <p>Driver Details:</p>
      <p>Name: ${driverDetails.name}</p>
      <p>Contact: ${driverDetails.mobile}</p>
      <p>Good Details:</p>
      <p>${goodDetails}</p>
    `,
  };

  try {
    const driverInfo = await mailTransporter.sendMail(driverEmailOptions);
    const clientInfo = await mailTransporter.sendMail(clientEmailOptions);
    console.log('Driver email sent:', driverInfo.response);
    console.log('Client email sent:', clientInfo.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const updateInventory = asyncHandler(async(req,res) =>{
  const inventory = await WarehouseInventory.findById({_id:req.body.inventoryId})
  const driver = await Driver.findById({_id:req.body.driver})

  const inventoryDetails = {Name:inventory.itemName, Description:inventory.itemDescription, Value:inventory.itemValue}
  
  sendAssignmentEmail(driver.email, inventory.customerEmail, driver, inventoryDetails);
  inventory.driver = driver.name
  inventory.save()
  res.status(200).json({message:"Driver Assigned Successfully"})
  
})

const assignDriver = asyncHandler(async(req,res) =>{
  const service = await Service.findById({_id:req.body.serviceId})
  const driver = await Driver.findById({_id:req.body.driver})

  const inventoryDetails = {Name:service.service, Description:service.description}

  sendAssignmentEmail(driver.email, service.email, driver, inventoryDetails);
  service.driver = driver.name
  service.save()
  res.status(200).json({message:"Driver Assigned Successfully"})
})


module.exports ={
    newService,
    allService,
    singleService,
    updateService,
    updateDocument,
    deleteOrAbortQuote,
    ExchangeRatesFunction,
    getExchangeRates,
    ChangeProgress,
    AddInventory,
    getInventories,
    getSingleInventory,
    updateInventory,
    assignDriver
}