import { ContextMenu } from '@/components/core/context-menu';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { getSeverityLabel } from '@/lib/app-specific/headache-settings';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRecords } from '@/providers/records-provider';
import type { HeadacheRecord } from '@/types/app-specific/headache-record';
import { ArrowUpDown, GalleryVerticalEnd } from 'lucide-react-native';

import { HeaderIconButton } from '@/components/core/header-button';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import { useViewedScreen } from '@/utils/posthog';
import { compareAsc, compareDesc } from 'date-fns';
import { useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { HorizontalImageRecordItem } from './horizontal-image-record-item';

iconWithClassName(ArrowUpDown);
iconWithClassName(GalleryVerticalEnd);

const getRecordSearchText = (record: HeadacheRecord): string => {
  return [
    record.notes,
    record.headacheType,
    getSeverityLabel({ severity: record.severity }),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
};

const getRecordTitle = (record: HeadacheRecord): string => {
  return `Severity ${record.severity}/10`;
};

const HistoryScreen = ({
  onPressRecord,
}: {
  onPressRecord: (recordId: string) => void;
}) => {
  const { t } = useTranslation();
  const { records, deleteRecordId } = useRecords();
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const { sortOrderPreferenceValue, sortOrderPreferenceSetValue } =
    useAsyncStorage();
  const { paddingTop, paddingBottom } = useSafeAreaInsets({
    contentPadding: 'none',
  });

  useViewedScreen('history');

  const sortedAndFilteredRecords = useMemo(() => {
    const searchLower = search.toLowerCase();
    const filteredRecords = records.filter((record) => {
      // Search through record fields
      return getRecordSearchText(record).includes(searchLower);
    });

    return filteredRecords.sort((a, b) => {
      if (sortOrderPreferenceValue === 'name-asc') {
        return getRecordTitle(a).localeCompare(getRecordTitle(b));
      }
      if (sortOrderPreferenceValue === 'name-desc') {
        return getRecordTitle(b).localeCompare(getRecordTitle(a));
      }
      if (sortOrderPreferenceValue === 'date-newest') {
        return compareDesc(new Date(a.event), new Date(b.event));
      }
      if (sortOrderPreferenceValue === 'date-oldest') {
        return compareAsc(new Date(a.event), new Date(b.event));
      }
      return 0;
    });
  }, [records, search, sortOrderPreferenceValue]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ContextMenu
          actions={[
            {
              title: t('history.sortQuestionAZ'),
              systemIcon:
                sortOrderPreferenceValue === 'name-asc'
                  ? 'checkmark'
                  : undefined,
              onPress: () => {
                sortOrderPreferenceSetValue('name-asc');
              },
            },
            {
              title: t('history.sortQuestionZA'),
              systemIcon:
                sortOrderPreferenceValue === 'name-desc'
                  ? 'checkmark'
                  : undefined,
              onPress: () => {
                sortOrderPreferenceSetValue('name-desc');
              },
            },
            {
              title: t('history.sortDateNewest'),
              systemIcon:
                sortOrderPreferenceValue === 'date-newest'
                  ? 'checkmark'
                  : undefined,
              onPress: () => {
                sortOrderPreferenceSetValue('date-newest');
              },
            },
            {
              title: t('history.sortDateOldest'),
              systemIcon:
                sortOrderPreferenceValue === 'date-oldest'
                  ? 'checkmark'
                  : undefined,
              onPress: () => {
                sortOrderPreferenceSetValue('date-oldest');
              },
            },
          ]}
        >
          <HeaderIconButton
            onPress={() => {}}
            disabled={false}
          >
            <ArrowUpDown
              size={CONFIG.icon.size.md}
              className="text-primary"
            />
          </HeaderIconButton>
        </ContextMenu>
      ),
    });
  }, [navigation, sortOrderPreferenceValue, sortOrderPreferenceSetValue, t]);

  return (
    <FlatList
      contentContainerClassName="px-2"
      contentContainerStyle={{
        paddingTop,
        paddingBottom,
      }}
      data={sortedAndFilteredRecords}
      keyExtractor={(item) => item.id}
      contentInsetAdjustmentBehavior="automatic"
      ListHeaderComponent={
        <View>
          <Input
            className="my-3 bg-muted"
            placeholder={t('history.search')}
            onChangeText={setSearch}
            autoCapitalize="words"
            autoCorrect={false}
            value={search}
            clearButtonMode="always"
          />
        </View>
      }
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-20 ">
          <GalleryVerticalEnd
            size={CONFIG.icon.size['3xl']}
            className="text-primary mb-4"
            strokeWidth={1.5}
          />
          <Text className="text-xl font-semibold text-foreground mb-1">
            {t('history.noConversationsYet')}
          </Text>
          <Text className="text-sm text-muted-foreground text-center px-8">
            {t('history.noConversationsMessage')}
          </Text>
        </View>
      }
      renderScrollComponent={(props) => <KeyboardAwareScrollView {...props} />}
      renderItem={({ item, separators }) => {
        const title = getRecordTitle(item);

        return (
          <HorizontalImageRecordItem
            title={title}
            titleClassName="line-clamp-3 text-base"
            date={new Date(item.event)}
            onDelete={() => deleteRecordId({ id: item.id })}
            onPress={() => onPressRecord(item.id)}
            onPressIn={() => separators.highlight()}
            onPressOut={() => separators.unhighlight()}
          />
        );
      }}
      // ItemSeparatorComponent={() => <View className="my-2 h-[1px] bg-muted" />}
      ItemSeparatorComponent={() => <View className="my-2 bg-muted" />}
      className="px-2"
      showsVerticalScrollIndicator={false}
    />
  );
};

export default HistoryScreen;
