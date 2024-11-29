import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Report = () => {
  const [fees, setFees] = useState([]);
  const [costs, setCosts] = useState([]);
  const [donations, setDonations] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [totalFees, setTotalFees] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const years = ['2021', '2022', '2023', '2024'];

  // Fetch the data whenever the selected month or year changes
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchFeesData(selectedMonth, selectedYear);
      fetchCostsData(selectedMonth, selectedYear);
      fetchDonationsData(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  // Fetch fees data from Firestore
  const fetchFeesData = async (month, year) => {
    try {
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

      console.log("Fetched Fees Data:", feesData); // Debugging line

      // Ensure the amount is a valid number
      const total = feesData.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);

      setFees(feesData);
      setTotalFees(total);
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

  // Calculate profit/loss after fetching data
  useEffect(() => {
    setProfitLoss(totalFees + totalDonations - totalCosts);
  }, [totalFees, totalCosts, totalDonations]);

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(`Monthly Report for ${selectedMonth} ${selectedYear}`, 14, 20);

    // Fees Table
    doc.setFontSize(14);
    doc.text('Fees', 14, 30);
    doc.autoTable({
      startY: 35,
      head: [['Amount (tk)', 'Month', 'Year']],
      body: fees.map((fee) => [fee.amount, fee.month, fee.year]),
    });

    // Donations Table
    doc.text('Donations', 14, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['Amount (tk)', 'Month', 'Year']],
      body: donations.map((donation) => [donation.amount, donation.month, donation.year]),
    });

    // Costs Table
    doc.text('Costs', 14, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 15,
      head: [['Name', 'Amount (tk)', 'Month', 'Year', 'Type']],
      body: costs.map((cost) => [cost.name, cost.amount, cost.month, cost.year, cost.type]),
    });

    // Profit/Loss
    doc.text(
      `Profit/Loss: ${profitLoss >= 0 ? `Profit ${profitLoss} tk` : `Loss ${Math.abs(profitLoss)} tk`}`,
      14,
      doc.autoTable.previous.finalY + 30
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
          <h5>Fees</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {fees.length > 0 ? (
                fees.map((fee, index) => (
                  <tr key={index}>
                    <td>{fee.month}</td>
                    <td>{fee.year}</td>
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
          <h5>Total Fees: {totalFees} tk</h5>

          {/* Donations Table */}
          <h5 className="mt-5">Donations</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? (
                donations.map((donation, index) => (
                  <tr key={index}>
                    <td>{donation.month}</td>
                    <td>{donation.year}</td>
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
          <h5>Total Donations: {totalDonations} tk</h5>

          {/* Costs Table */}
          <h5 className="mt-5">Costs</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Month</th>
                <th>Year</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {costs.length > 0 ? (
                costs.map((cost, index) => (
                  <tr key={index}>
                    <td>{cost.name}</td>
                    <td>{cost.month}</td>
                    <td>{cost.year}</td>
                    <td>{cost.type}</td>
                    <td>{cost.amount} tk</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No costs found for the selected month/year.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <h5>Total Costs: {totalCosts} tk</h5>

          {/* Profit/Loss */}
          <h5 className="mt-5">
            Profit/Loss: {profitLoss >= 0 ? `Profit ${profitLoss} tk` : `Loss ${Math.abs(profitLoss)} tk`}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Report;
