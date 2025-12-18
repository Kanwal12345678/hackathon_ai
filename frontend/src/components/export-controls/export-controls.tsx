import React, { useState } from 'react';
import { textbookApiService } from '../../services/textbook-api';

interface ExportControlsProps {
  textbookId: string;
  onExportStart?: (requestId: string) => void;
  onExportComplete?: (downloadUrl: string) => void;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  textbookId,
  onExportStart,
  onExportComplete
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'epub' | 'html'>('pdf');
  const [includeExercises, setIncludeExercises] = useState(true);
  const [includeSolutions, setIncludeSolutions] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!textbookId) {
      setExportError('No textbook selected for export');
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const response = await textbookApiService.exportTextbook(
        textbookId,
        exportFormat,
        includeExercises,
        includeSolutions
      );

      if (response.data.exportRequestId && onExportStart) {
        onExportStart(response.data.exportRequestId);
      }

      // Simulate polling for export completion
      // In a real implementation, you would poll the export status API
      setTimeout(() => {
        if (response.data.downloadUrl && onExportComplete) {
          onExportComplete(response.data.downloadUrl);
        }
        setIsExporting(false);
      }, 3000);
    } catch (error: any) {
      console.error('Export error:', error);
      setExportError(error.message || 'Export failed. Please try again.');
      setIsExporting(false);
    }
  };

  return (
    <div className="export-controls">
      <h3>Export Textbook</h3>

      {exportError && (
        <div className="error-message">
          <p>{exportError}</p>
        </div>
      )}

      <div className="export-options">
        <div className="form-group">
          <label htmlFor="format">Export Format:</label>
          <select
            id="format"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'epub' | 'html')}
            disabled={isExporting}
          >
            <option value="pdf">PDF</option>
            <option value="epub">ePub</option>
            <option value="html">HTML</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={includeExercises}
              onChange={(e) => setIncludeExercises(e.target.checked)}
              disabled={isExporting}
            />
            Include Exercises
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={includeSolutions}
              onChange={(e) => setIncludeSolutions(e.target.checked)}
              disabled={isExporting || !includeExercises}
            />
            Include Solutions
          </label>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className="export-btn"
      >
        {isExporting ? `Exporting as ${exportFormat.toUpperCase()}...` : `Export as ${exportFormat.toUpperCase()}`}
      </button>
    </div>
  );
};

export default ExportControls;