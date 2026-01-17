import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { imageApi } from '../../api/image.api';

export interface ImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageCustom: {
      setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;
    };
  }
}

export const ImageCustom = Node.create<ImageOptions>({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      loading: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey('imageUpload'),
        props: {
          handleDOMEvents: {
            // 드래그 앤 드롭
            drop(view, event) {
              const hasFiles = event.dataTransfer?.files?.length;

              if (!hasFiles) {
                return false;
              }

              const images = Array.from(event.dataTransfer.files).filter((file) =>
                file.type.startsWith('image/')
              );

              if (images.length === 0) {
                return false;
              }

              event.preventDefault();

              // 드롭한 위치 계산
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              if (!coordinates) {
                return false;
              }

              images.forEach((image) => {
                uploadImage(image, editor, coordinates.pos);
              });

              return true;
            },
            // 붙여넣기
            paste(view, event) {
              const hasFiles = event.clipboardData?.files?.length;

              if (!hasFiles) {
                return false;
              }

              const images = Array.from(event.clipboardData.files).filter((file) =>
                file.type.startsWith('image/')
              );

              if (images.length === 0) {
                return false;
              }

              event.preventDefault();

              images.forEach((image) => {
                uploadImage(image, editor);
              });

              return true;
            },
          },
        },
      }),
    ];
  },
});

// 이미지 업로드 함수
async function uploadImage(file: File, editor: any, position?: number) {
  // 로딩 플레이스홀더 삽입
  const placeholderId = `uploading-${Date.now()}`;
  
  if (position !== undefined) {
    // 드롭한 위치에 삽입
    editor
      .chain()
      .insertContentAt(position, {
        type: 'image',
        attrs: {
          src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          alt: 'Uploading...',
          loading: placeholderId,
        },
      })
      .run();
  } else {
    // 현재 커서 위치에 삽입 (붙여넣기)
    editor
      .chain()
      .focus()
      .setImage({
        src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        alt: 'Uploading...',
        loading: placeholderId,
      })
      .run();
  }

  try {
    const response = await imageApi.upload(file);

    if (response.success) {
      // 플레이스홀더를 실제 이미지로 교체
      const { state } = editor;
      const { doc } = state;

      doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'image' && node.attrs.loading === placeholderId) {
          editor
            .chain()
            .setNodeSelection(pos)
            .setImage({
              src: response.data.url,
              alt: response.data.originalName,
            })
            .run();
          return false;
        }
        return true;
      });
    }
  } catch (error) {
    console.error('이미지 업로드 실패:', error);

    // 플레이스홀더 제거
    const { state } = editor;
    const { doc } = state;

    doc.descendants((node: any, pos: number) => {
      if (node.type.name === 'image' && node.attrs.loading === placeholderId) {
        editor.chain().setNodeSelection(pos).deleteSelection().run();
        return false;
      }
      return true;
    });

    // 에러 알림
    alert('이미지 업로드에 실패했습니다.');
  }
}