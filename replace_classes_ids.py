#!/usr/bin/env python3
import re
import os

# Маппинг замен CLASS (только те что реально используются)
class_replacements = {
    'about_grid': 'company_block',
    'about_images': 'company_img',
    'accordion_body_inner': 'accordion_body_txt',
    'accordion_head': 'accordion_name',
    'bg1_section': 'preim_section',
    'carousel_block': 'carousel_brand',
    'carousel_head': 'section_carousel',
    'category_layout': 'category_left',
    'category_main': 'category_right',
    'contacts_desc': 'phtel_desc',
    'contacts_grid': 'phtel_grid',
    'contacts_item': 'phtel_item',
    'contacts_name': 'phtel_name',
    'footer_bottom_strip': 'footer_bottom',
    'footer_contacts_row': 'footer_contact',
    'footer_legal': 'footer_copy',
    'has_sub': 'menu_sub',
    'head_top_actions': 'head_top_block',
    'head_top_inner': 'head_top_line',
    'head_top_phone_wrap': 'head_top_phone_block',
    'hero': 'home_slid',
    'hero_content': 'home_slid_block',
    'hero_features': 'home_slid_preim',
    'hero_grid': 'home_slid_section',
    'hero_media': 'home_slid_img',
    'hero_stats': 'home_slid_preim2',
    'hero_subtitle': 'home_slid_slogan',
    'img_carousel': 'carousel_gallery',
    'info_item': 'contact_li',
    'info_name': 'contact_li_name',
    'map_frame': 'karta_block',
    'mega': 'dop_razdel_manu',
    'nav_dropdown_group_name': 'nav_dropdown_name_razdela',
    'news_carousel': 'carousel_news',
    'news_detail_body': 'news_detail_block',
    'news_detail_grid': 'news_detail_section',
    'otzivy_carousel': 'carousel_otzivy',
    'services_grid': 'services_block',
    'social_nav': 'soc_nav',
    'stat': 'preim2',
    'stat_name': 'preim2_name',
    'stat_subtitle': 'preim2_slogan',
    'upper': 'h2_them1',
}

# Маппинг замен ID
id_replacements = {
    'block_akcii': 'section_akcii',
    'block_company': 'section_company',
    'block_faq': 'section_faq',
    'block_map': 'section_karta',
    'block_my_preim': 'section_preim',
    'block_otziv': 'section_otzivy',
    'block_preim_num': 'section_pr_num',
    'block_service': 'section_service',
    'feedback': 'section_forma',
}

def replace_class_in_attr(content, old_class, new_class):
    """Заменяет класс в атрибуте class=\"...\""""
    # Паттерн для замены класса внутри атрибута class
    pattern = r'(\s+class\s*=\s*["\'])([^"\']*?)\b' + re.escape(old_class) + r'\b([^"\']*?)(["\'])'
    
    def replacer(match):
        prefix = match.group(1)  # \s+class="
        before = match.group(2)  # текст до класса
        after = match.group(3)   # текст после класса
        suffix = match.group(4)  # закрывающая кавычка
        
        # Заменяем класс, сохраняя пробелы вокруг если они были
        new_before = before
        new_after = after
        
        # Проверяем был ли пробел перед классом
        if before and not before.endswith(' '):
            # Класс был в начале или после другого класса без пробела (невозможно)
            pass
        
        # Проверяем был ли пробел после класса
        if after and not after.startswith(' '):
            pass
            
        # Простая замена - убираем старый класс и ставим новый
        classes_before = before.strip().split() if before.strip() else []
        classes_after = after.strip().split() if after.strip() else []
        all_classes = classes_before + [new_class] + classes_after
        new_classes = ' '.join(all_classes)
        
        return prefix + new_classes + suffix
    
    content = re.sub(pattern, replacer, content)
    return content

def replace_in_file(filepath, class_map, id_map):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Заменяем ID в атрибуте id="..."
    for old_id, new_id in id_map.items():
        content = re.sub(r'(\s+id\s*=\s*["\'])' + re.escape(old_id) + r'(["\'])', 
                        r'\g<1>' + new_id + r'\g<2>', content)
    
    # Заменяем CLASS в атрибуте class="..."
    for old_class, new_class in class_map.items():
        content = replace_class_in_attr(content, old_class, new_class)
    
    # Заменяем селекторы CSS .class и #id
    for old_class, new_class in class_map.items():
        content = re.sub(r'\.' + re.escape(old_class) + r'(?![a-zA-Z0-9_-])', f'.{new_class}', content)
    
    for old_id, new_id in id_map.items():
        content = re.sub(r'#' + re.escape(old_id) + r'(?![a-zA-Z0-9_-])', f'#{new_id}', content)
    
    # Заменяем в JS querySelector и classList
    for old_class, new_class in class_map.items():
        content = re.sub(r'querySelectorAll\(["\']\\.' + re.escape(old_class) + r'["\']\)', 
                        f'querySelectorAll(".{new_class}")', content)
        content = re.sub(r'querySelector\(["\']\\.' + re.escape(old_class) + r'["\']\)', 
                        f'querySelector(".{new_class}")', content)
        content = re.sub(r'\.classList\.contains\(["\']?' + re.escape(old_class) + r'["\']?\)', 
                        f'.classList.contains("{new_class}")', content)
        content = re.sub(r'\.classList\.add\(["\']?' + re.escape(old_class) + r'["\']?\)', 
                        f'.classList.add("{new_class}")', content)
        content = re.sub(r'\.classList\.remove\(["\']?' + re.escape(old_class) + r'["\']?\)', 
                        f'.classList.remove("{new_class}")', content)
        content = re.sub(r'\.classList\.toggle\(["\']?' + re.escape(old_class) + r'["\']?\)', 
                        f'.classList.toggle("{new_class}")', content)
    
    for old_id, new_id in id_map.items():
        content = re.sub(r'getElementById\(["\']?' + re.escape(old_id) + r'["\']?\)', 
                        f'getElementById("{new_id}")', content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    files_to_process = []
    for root, dirs, files in os.walk('/workspace'):
        # Пропускаем vendor директории и скрипт замены
        if 'vendor' in root or 'replace_classes_ids.py' in root:
            continue
        for file in files:
            if file.endswith(('.html', '.css', '.scss', '.js')):
                filepath = os.path.join(root, file)
                if 'replace_classes_ids.py' not in filepath and 'vendor' not in filepath:
                    files_to_process.append(filepath)
    
    replaced_count = 0
    for filepath in sorted(files_to_process):
        if replace_in_file(filepath, class_replacements, id_replacements):
            print(f"Updated: {filepath}")
            replaced_count += 1
        else:
            print(f"No changes: {filepath}")
    
    print(f"\nTotal files updated: {replaced_count}/{len(files_to_process)}")

if __name__ == '__main__':
    main()
