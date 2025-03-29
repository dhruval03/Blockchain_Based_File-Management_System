import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import UploadFilePage from '../components/UploadFilePage';
import { ethers } from 'ethers';

jest.mock('axios');

const mockSendTransaction = jest.fn().mockResolvedValue({ wait: jest.fn() });
const mockGetSigner = jest.fn().mockResolvedValue({ sendTransaction: mockSendTransaction });
const mockProvider = { getSigner: mockGetSigner };

beforeAll(() => {
  window.ethereum = {};
  ethers.BrowserProvider = jest.fn().mockReturnValue(mockProvider);
});

describe('UploadFilePage', () => {
  test('renders upload button', () => {
    render(<UploadFilePage />);
    expect(screen.getByText(/Upload to IPFS/i)).toBeInTheDocument();
  });

  test('displays error if no file selected', async () => {
    render(<UploadFilePage />);
    fireEvent.click(screen.getByText(/Upload to IPFS/i));
    await waitFor(() => {
      expect(screen.getByText(/Please select a file to upload/i)).toBeInTheDocument();
    });
  });

  test('displays payment confirmation when file is selected', async () => {
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });

    render(
      <>
        <UploadFilePage />
        <ToastContainer />
      </>
    );

    const fileInput = screen.getByLabelText(/Choose file/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    global.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText(/Upload to IPFS/i));

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(mockSendTransaction).toHaveBeenCalled();
    });
  });

  test('handles failed payment gracefully', async () => {
    // Mock the transaction to resolve, but make the wait function throw an error
    mockSendTransaction.mockResolvedValueOnce({ wait: jest.fn().mockRejectedValueOnce(new Error('Payment failed')) });

    render(
        <>
            <UploadFilePage />
            <ToastContainer />
        </>
    );

    global.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText(/Upload to IPFS/i));

    await waitFor(() => {
        expect(screen.getByText(/Payment failed. Please try again./i)).toBeInTheDocument();
    });

    // Check that a success message is not displayed
    expect(screen.queryByText(/Payment successful. Uploading file to IPFS.../i)).not.toBeInTheDocument();
});


  test('handles failed payment gracefully', async () => {
    mockSendTransaction.mockRejectedValueOnce(new Error('Payment failed'));
    
    render(
      <>
        <UploadFilePage />
        <ToastContainer />
      </>
    );

    global.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText(/Upload to IPFS/i));

    await waitFor(() => {
      expect(screen.getByText(/Payment failed. Please try again./i)).toBeInTheDocument();
    });
  });
});
