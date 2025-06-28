import { Modal, Button } from 'react-bootstrap';
import './WinnerModal.css'; // Optional for animation/custom styles
import { useNavigate } from 'react-router-dom';

function WinnerModal({ show, winners, handleClose, handleNewMatch }) {
  const navigate = useNavigate();

  const shareText = `🏆 Match Results! Winner${winners.length > 1 ? 's' : ''}: ${winners
    .map(w => w.name)
    .join(', ')} with ${winners[0]?.score || 0} points!`;

  const handleShare = (platform) => {
    const encoded = encodeURIComponent(shareText);
    let url = '';

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encoded}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=https://yourdomain.com&quote=${encoded}`;
        break;
      case 'email':
        url = `mailto:?subject=Pickleball Match Results&body=${encoded}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank');
  };

  return (
    <Modal show={show} onHide={handleClose} centered animation>
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>🎉 Match Complete!</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <h5 className="mb-3">
          Winner{winners.length > 1 ? 's' : ''}:
        </h5>
        {winners.map((w) => (
          <p key={w.name}>
            <strong>{w.name}</strong> with {w.score} points
          </p>
        ))}

        <hr />

        <p>Share your scorecard:</p>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="outline-primary" onClick={() => handleShare('twitter')}>
            Twitter
          </Button>
          <Button variant="outline-primary" onClick={() => handleShare('facebook')}>
            Facebook
          </Button>
          <Button variant="outline-secondary" onClick={() => handleShare('email')}>
            Email
          </Button>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleNewMatch}>
          Start New Match
        </Button>
        <Button variant="success" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WinnerModal;
