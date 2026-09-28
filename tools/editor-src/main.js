import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, Color, FontFamily, FontSize } from '@tiptap/extension-text-style';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import Underline from '@tiptap/extension-underline';

function isImageFile(file) {
  return !!file && (file.type.indexOf('image/') === 0 || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name || ''));
}

window.YAEditor = {
  create: function (element, options) {
    options = options || {};
    var editor = new Editor({
      element: element,
      content: options.content || '',
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          link: {
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',
            HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
          },
        }),
        TextStyle,
        Color,
        FontFamily,
        FontSize,
        Underline,
        ImageExtension.configure({ allowBase64: false }),
        Placeholder.configure({ placeholder: options.placeholder || 'اكتب هنا…' }),
        TaskList,
        TaskItem.configure({ nested: true }),
      ],
      editorProps: {
        attributes: { class: 'ya-editor-content' },
        handlePaste: function (view, event) {
          var files = Array.prototype.slice.call((event.clipboardData && event.clipboardData.files) || []).filter(isImageFile);
          if (!files.length) return false;
          event.preventDefault();
          if (options.onImageFiles) options.onImageFiles(files);
          return true;
        },
        handleDrop: function (view, event) {
          var files = Array.prototype.slice.call((event.dataTransfer && event.dataTransfer.files) || []).filter(isImageFile);
          if (!files.length) return false;
          event.preventDefault();
          if (options.onImageFiles) options.onImageFiles(files);
          return true;
        },
      },
      onUpdate: function () { if (options.onUpdate) options.onUpdate(editor); },
      onSelectionUpdate: function () { if (options.onSelection) options.onSelection(editor); },
    });
    return editor;
  },
};
