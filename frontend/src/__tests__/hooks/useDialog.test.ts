// tests/__tests__/hooks/useDialog.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDialog } from '../../hooks/useDialog';
import { vi, expect, it, describe } from 'vitest';

describe('useDialog', () => {
  it('should open the dialog when handleDeleteClick is called', () => {
    const { result } = renderHook(() => useDialog());

    expect(result.current.dialogOpen).toBe(false);

    act(() => {
      result.current.handleDeleteClick('123');
    });

    expect(result.current.dialogOpen).toBe(true);
  });

  it('should close the dialog box after clicking "Cancel"', () => {
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.handleDeleteClick('123');
    });

    expect(result.current.dialogOpen).toBe(true);

    act(() => {
      result.current.setDialogOpen(false);
    });

    expect(result.current.dialogOpen).toBe(false);
  });

  it('should call handleConfirmDelete with the correct id', () => {
    const mockOnDelete = vi.fn();
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.handleDeleteClick('123');
    });

    act(() => {
      result.current.handleConfirmDelete(mockOnDelete);
    });

    expect(mockOnDelete).toHaveBeenCalledWith('123');
  });

  it('should call onDelete when selectedId is set', () => {
    const mockOnDelete = vi.fn();
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.handleDeleteClick('123');
    });

    act(() => {
      result.current.handleConfirmDelete(mockOnDelete);
    });

    expect(mockOnDelete).toHaveBeenCalledWith('123');
  });

  it('should not call onDelete when selectedId is null', () => {
    const mockOnDelete = vi.fn();
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.handleConfirmDelete(mockOnDelete);
    });

    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
