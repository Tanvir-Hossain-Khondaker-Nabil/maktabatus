import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Report = () => {
  const [fees, setFees] = useState([]);
  const [costs, setCosts] = useState([]);
  const [donations, setDonations] = useState([]);
  const [functionalFees, setFunctionalFees] = useState([]);  // Added state for functional fees
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [totalFees, setTotalFees] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalFunctionalFees, setTotalFunctionalFees] = useState(0); // Added total for functional fees
  const [profitLoss, setProfitLoss] = useState(0);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Fetch the data whenever the selected month or year changes
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchFeesData(selectedMonth, selectedYear);
      fetchCostsData(selectedMonth, selectedYear);
      fetchDonationsData(selectedMonth, selectedYear);
      fetchFunctionalFeesData(selectedMonth, selectedYear);  // Added functional fees fetch
    }
  }, [selectedMonth, selectedYear]);

  // Fetch fees data from Firestore
  const fetchFeesData = async (month, year) => {
    try {
      // Fetch fees data for the specific month and year
      const feesQuery = query(
        collection(db, 'fees'),
        where('month', '==', month),
        where('year', '==', parseInt(year))
      );
      const feesSnapshot = await getDocs(feesQuery);
      const feesData = feesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch all members to map member details later
      const membersSnapshot = await getDocs(collection(db, 'members'));
      const membersData = membersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Combine fees data with member data based on memberId
      const feesWithMemberDetails = feesData.map((fee) => {
        const member = membersData.find((m) => m.id === fee.memberId); // Match memberId from fee to member's id
        return {
          ...fee,
          memberName: member ? member.name : 'Unknown',
          profileImage: member ? member.imageUrl : '',  // Add profile image URL
          amount: parseFloat(fee.amount) || 0,  // Ensure amount is a number
        };
      });

      // Calculate total amount of fees
      const total = feesWithMemberDetails.reduce((sum, fee) => sum + fee.amount, 0);

      setFees(feesWithMemberDetails);
      setTotalFees(total);  // Update total fees state
    } catch (error) {
      console.error('Error fetching fees data:', error);
    }
  };


  // Fetch costs data from Firestore
  const fetchCostsData = async (month, year) => {
    try {
      const costsQuery = query(
        collection(db, 'costs'),
        where('month', '==', month),
        where('year', '==', year)
      );
      const costsSnapshot = await getDocs(costsQuery);
      const costsData = costsSnapshot.docs.map((doc) => doc.data());

      const total = costsData.reduce((sum, cost) => sum + parseFloat(cost.amount), 0);
      setCosts(costsData);
      setTotalCosts(total);
    } catch (error) {
      console.error('Error fetching costs data:', error);
    }
  };

  // Fetch donations data from Firestore
  const fetchDonationsData = async (month, year) => {
    try {
      const donationsQuery = query(
        collection(db, 'donations'),
        where('month', '==', month),
        where('year', '==', parseInt(year))
      );
      const donationsSnapshot = await getDocs(donationsQuery);

      console.log("Donations Snapshot:", donationsSnapshot); // Debugging line

      if (!donationsSnapshot.empty) {
        const donationsData = donationsSnapshot.docs.map((doc) => doc.data());
        console.log("Donations Data:", donationsData); // Debugging line

        const total = donationsData.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
        setDonations(donationsData);
        setTotalDonations(total);
      } else {
        console.log('No donations found for the selected month/year');
      }
    } catch (error) {
      console.error('Error fetching donations data:', error);
    }
  };

  // Fetch functional fees and member data based on month and year
  const fetchFunctionalFeesData = async (month, year) => {
    try {
      // Fetch functional fees data for the specific month and year
      const functionalFeesQuery = query(
        collection(db, 'functional_fees'),
        where('month', '==', month),
        where('year', '==', parseInt(year))
      );
      const functionalFeesSnapshot = await getDocs(functionalFeesQuery);
      const functionalFeesData = functionalFeesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch all members to map member details later
      const membersSnapshot = await getDocs(collection(db, 'members'));
      const membersData = membersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Combine functional fees data with member data based on memberId
      const functionalFeesWithMemberDetails = functionalFeesData.map((fee) => {
        const member = membersData.find((m) => m.id === fee.memberId); // Match memberId from fee to member's id
        return {
          ...fee,
          memberName: member ? member.name : 'Unknown',
          profileImage: member ? member.imageUrl : '',  // Add profile image URL
          amount: parseFloat(fee.amount) || 0,  // Ensure amount is a number
        };
      });

      // Calculate total amount of functional fees
      const total = functionalFeesWithMemberDetails.reduce((sum, fee) => sum + fee.amount, 0);

      setFunctionalFees(functionalFeesWithMemberDetails);
      setTotalFunctionalFees(total);  // Update total functional fees state
    } catch (error) {
      console.error('Error fetching functional fees data:', error);
    }
  };


  // Calculate profit/loss after fetching data
  useEffect(() => {
    setProfitLoss(totalFees + totalDonations + totalFunctionalFees - totalCosts);
  }, [totalFees, totalCosts, totalDonations, totalFunctionalFees]);



  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4'); // Set page size to A4 (portrait mode)

    // Title Section
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Monthly Report for ${selectedMonth} ${selectedYear}`, 14, 20);

    // Set margins
    const margin = { top: 25, left: 14, bottom: 15, right: 14 };
    let yPosition = doc.lastAutoTable.finalY + 10 || 30;

    // Fees Table Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Fees', margin.left, yPosition);

    // Table headers and body
    const tableHeader = [['Member Name', 'Amount (tk)', 'Month', 'Year']];
    const tableBody = fees.map((fee) => [
      fee.memberName,
      fee.amount,
      fee.month,
      fee.year
    ]);

    // Add Fees Table
    doc.autoTable({
      startY: yPosition + 10,
      head: tableHeader,
      body: tableBody,
      margin: { top: yPosition + 10, left: margin.left },
      styles: {
        fontSize: 10,  // Smaller font size to fit better
        cellPadding: 2,  // Reduced padding to minimize row height
        halign: 'center',  // Center align table content
        fillColor: [144, 238, 144],  // Soft green background for header
        textColor: [0, 0, 0],  // Black font color for header
        lineColor: [0, 0, 0],  // Black border lines for table
        lineWidth: 0.1,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],  // White background for table data cells
        textColor: [0, 0, 0],  // Black font color for table data cells
      }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Functional Fees Table Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Functional Fees', margin.left, yPosition);

    const functionalFeesBody = functionalFees.map((fee) => [
      fee.memberName,
      fee.amount,
      fee.month,
      fee.year
    ]);

    // Add Functional Fees Table
    doc.autoTable({
      startY: yPosition + 10,
      head: [['Member Name', 'Amount (tk)', 'Month', 'Year']],
      body: functionalFeesBody,
      margin: { top: yPosition + 10, left: margin.left },
      styles: {
        fontSize: 10,  // Smaller font size to fit better
        cellPadding: 2,  // Reduced padding to minimize row height
        halign: 'center',  // Center align table content
        fillColor: [144, 238, 144],  // Soft green background for header
        textColor: [0, 0, 0],  // Black font color for header
        lineColor: [0, 0, 0],  // Black border lines for table
        lineWidth: 0.1,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],  // White background for table data cells
        textColor: [0, 0, 0],  // Black font color for table data cells
      }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Donations Table Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Donations', margin.left, yPosition);

    const donationsBody = donations.map((donation) => [
      donation.name,
      donation.mobile,
      donation.amount
    ]);

    // Add Donations Table
    doc.autoTable({
      startY: yPosition + 10,
      head: [['Name', 'Mobile', 'Amount (tk)']],
      body: donationsBody,
      margin: { top: yPosition + 10, left: margin.left },
      styles: {
        fontSize: 10,  // Smaller font size to fit better
        cellPadding: 2,  // Reduced padding to minimize row height
        halign: 'center',  // Center align table content
        fillColor: [144, 238, 144],  // Soft green background for header
        textColor: [0, 0, 0],  // Black font color for header
        lineColor: [0, 0, 0],  // Black border lines for table
        lineWidth: 0.1,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],  // White background for table data cells
        textColor: [0, 0, 0],  // Black font color for table data cells
      }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Costs Table Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Costs', margin.left, yPosition);

    const costsBody = costs.map((cost) => [cost.name, cost.amount, cost.type]);

    // Add Costs Table
    doc.autoTable({
      startY: yPosition + 10,
      head: [['Name', 'Amount (tk)', 'Type']],
      body: costsBody,
      margin: { top: yPosition + 10, left: margin.left },
      styles: {
        fontSize: 10,  // Smaller font size to fit better
        cellPadding: 2,  // Reduced padding to minimize row height
        halign: 'center',  // Center align table content
        fillColor: [144, 238, 144],  // Soft green background for header
        textColor: [0, 0, 0],  // Black font color for header
        lineColor: [0, 0, 0],  // Black border lines for table
        lineWidth: 0.1,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],  // White background for table data cells
        textColor: [0, 0, 0],  // Black font color for table data cells
      }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Profit/Loss Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Profit/Loss: ${profitLoss >= 0 ? `Profit ${profitLoss} tk` : `Loss ${Math.abs(profitLoss)} tk`}`,
      margin.left,
      yPosition + 10
    );

    // Save the PDF
    doc.save(`Monthly_Report_${selectedMonth}_${selectedYear}.pdf`);
  };





  return (
    <div className="card">
      <div className="card-body">
        <h2 className="title">Monthly Report</h2>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="month" className="form-label">Select Month</label>
            <select
              id="month"
              className="input-field"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select Month</option>
              {monthNames.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="year" className="form-label">Select Year</label>
            <select
              id="year"
              className="input-field"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button className="btn add-btn mb-4" onClick={generatePDF}>
              Download PDF
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h4>Report for {selectedMonth} {selectedYear}</h4>

          {/* Fees Table */}
          <h5 className="mt-5">Fees</h5>
          <div className="overflow-auto">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Member Image</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {fees.length > 0 ? (
                  fees.map((fee, index) => (
                    <tr key={index}>
                      <td>{fee.memberName}</td> {/* Display member name */}
                      <td>
                        {/* Display member image */}
                        {fee.profileImage ? (
                          <img src={fee.profileImage} alt={fee.memberName} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                        ) : (
                          <span>No image</span>
                        )}
                      </td>
                      <td>{fee.amount} tk</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No fees found for the selected month/year.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <h5>Total Fees: {totalFees} tk</h5>

          {/* Functional Fees Table */}
          <h5 className="mt-5">Functional Fees</h5>
          <div className="overflow-auto">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Member Image</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {functionalFees.length > 0 ? (
                  functionalFees.map((fee, index) => (
                    <tr key={index}>
                      <td>{fee.memberName}</td> {/* Display member name */}
                      <td>
                        {/* Display member image */}
                        {fee.profileImage ? (
                          <img src={fee.profileImage} alt={fee.memberName} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                        ) : (
                          <span>No image</span>
                        )}
                      </td>
                      <td>{fee.amount} tk</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No functional fees found for the selected month/year.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <h5>Total Functional Fees: {totalFunctionalFees} tk</h5>

          {/* Donations Table */}
          <h5 className="mt-5">Donations</h5>
          <div className="overflow-auto">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {donations.length > 0 ? (
                  donations.map((donation, index) => (
                    <tr key={index}>
                      <td>{donation.name}</td>
                      <td>{donation.mobile}</td>
                      <td>{donation.amount} tk</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No donations found for the selected month/year.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <h5>Total Donations: {totalDonations} tk</h5>

          {/* Costs Table */}
          <h5 className="mt-5">Costs</h5>
          <div className="overflow-auto">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {costs.length > 0 ? (
                  costs.map((cost, index) => (
                    <tr key={index}>
                      <td>{cost.name}</td>
                      <td>{cost.amount} tk</td>
                      <td>{cost.type}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No costs found for the selected month/year.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <h5>Total Costs: {totalCosts} tk</h5>

          {/* Profit/Loss */}
          <h5 className="mt-5">
            Profit/Loss: {profitLoss >= 0 ? `Profit ${profitLoss} tk` : `Loss ${Math.abs(profitLoss)} tk`}
          </h5>
        </div>
      </div>
      <style>
        {`
          table th, table td {
            min-width: 200px !important;
          }
        `}
      </style>
    </div>
  );
};

export default Report;
